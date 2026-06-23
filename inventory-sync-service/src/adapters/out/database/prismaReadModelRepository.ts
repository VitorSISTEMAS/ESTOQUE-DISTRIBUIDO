import { MOVEMENT_TYPES } from "../../../domain/entities/StockMovement.js"
import { ProcessedEvent } from "../../../domain/entities/ProcessedEvent.js"
import { prisma } from "./prismaClient.js"

export class PrismaReadModelRepository {
  async hasProcessed(eventId: string) {
    return prisma.processedEvent.findUnique({ where: { eventId } })
  }

  async applyProductCreated(event: Record<string, unknown>) {
    const { payload } = event as { payload: Record<string, unknown> }
    return prisma.$transaction(async (tx) => {
      await tx.productReadModel.upsert({
        where: { id: payload.productId as string },
        create: {
          id: payload.productId as string,
          name: payload.name as string,
          sku: payload.sku as string,
          description: payload.description as string | null | undefined,
          stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null,
          createdAt: new Date((payload.createdAt as string) || (event.occurredAt as string))
        },
        update: {
          name: payload.name as string,
          sku: payload.sku as string,
          description: payload.description as string | null | undefined,
          stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null
        }
      })

      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.CREATE as string,
          quantity: 0
        })
      })

      await this.recordProcessed(tx, event)
    })
  }

  async applyStockAdded(event: Record<string, unknown>) {
    const { payload } = event as { payload: Record<string, unknown> }
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event)
      await this.incrementStock(tx, payload, payload.branch as string, payload.quantity as number)
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.IN as string,
          branch: payload.branch as string,
          quantity: payload.quantity as number
        })
      })
      await this.recordProcessed(tx, event)
    })
  }

  async applySaleCompleted(event: Record<string, unknown>) {
    const { payload } = event as { payload: Record<string, unknown> }
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event)
      await this.incrementStock(tx, payload, payload.branch as string, -(payload.quantity as number))
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.SALE as string,
          branch: payload.branch as string,
          quantity: payload.quantity as number
        })
      })
      await this.recordProcessed(tx, event)
    })
  }

  async applyStockTransferred(event: Record<string, unknown>) {
    const { payload } = event as { payload: Record<string, unknown> }
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event)
      await this.incrementStock(tx, payload, payload.sourceBranch as string, -(payload.quantity as number))
      await this.incrementStock(tx, payload, payload.targetBranch as string, payload.quantity as number)
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.TRANSFER_OUT as string,
          branch: payload.sourceBranch as string,
          sourceBranch: payload.sourceBranch as string,
          targetBranch: payload.targetBranch as string,
          quantity: payload.quantity as number
        })
      })
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.TRANSFER_IN as string,
          branch: payload.targetBranch as string,
          sourceBranch: payload.sourceBranch as string,
          targetBranch: payload.targetBranch as string,
          quantity: payload.quantity as number
        })
      })
      await this.recordProcessed(tx, event)
    })
  }

  async ensureProduct(tx: Record<string, unknown>, payload: Record<string, unknown>, event: Record<string, unknown>) {
    await tx.productReadModel.upsert({
      where: { id: payload.productId as string },
      create: {
        id: payload.productId as string,
        name: (payload.productName || payload.name) as string,
        sku: payload.sku as string,
        description: (payload.description || null) as string | null,
        stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null,
        createdAt: new Date(event.occurredAt as string)
      },
      update: {
        name: (payload.productName || payload.name) as string,
        sku: payload.sku as string,
        stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null
      }
    })
  }

  async incrementStock(tx: Record<string, unknown>, payload: Record<string, unknown>, branch: string, quantityChange: number) {
    await tx.stockReadModel.upsert({
      where: { productId_branch: { productId: payload.productId as string, branch } },
      create: {
        productId: payload.productId as string,
        productName: (payload.productName || payload.name) as string,
        sku: payload.sku as string,
        branch,
        quantity: quantityChange,
        stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null,
        stockTypeName: (payload.stockTypeName || null) as string | null
      },
      update: {
        productName: (payload.productName || payload.name) as string,
        sku: payload.sku as string,
        quantity: { increment: quantityChange },
        stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null,
        stockTypeName: (payload.stockTypeName || null) as string | null
      }
    })
  }

  buildMovement(event: Record<string, unknown>, data: Record<string, unknown>): Record<string, unknown> {
    const { payload } = event as { payload: Record<string, unknown> }
    const stockTypeId = payload.stockTypeId ? Number(payload.stockTypeId) : null
    const stockTypeName = (payload.stockTypeName || null) as string | null
    return {
      productId: payload.productId as string,
      productName: (payload.productName || payload.name) as string,
      sku: payload.sku as string,
      type: data.type as string,
      branch: (data.branch || null) as string | null,
      sourceBranch: (data.sourceBranch || null) as string | null,
      targetBranch: (data.targetBranch || null) as string | null,
      quantity: data.quantity as number,
      stockTypeId,
      stockTypeName,
      createdAt: new Date(event.occurredAt as string)
    }
  }

  async applyBranchCreated(event: Record<string, unknown>) {
    const { payload } = event as { payload: Record<string, unknown> }
    return prisma.$transaction(async (tx) => {
      await tx.branch.upsert({
        where: { name: payload.name as string },
        create: {
          id: payload.id as string,
          name: payload.name as string,
          address: (payload.address || null) as string | null
        },
        update: {
          address: (payload.address || null) as string | null
        }
      })
      await this.recordProcessed(tx, event)
    })
  }

  async recordProcessed(tx: Record<string, unknown>, event: Record<string, unknown>) {
    new ProcessedEvent({
      eventId: event.eventId as string,
      eventType: event.eventType as string,
      payload: event.payload as Record<string, unknown>
    })

    await tx.processedEvent.create({
      data: {
        eventId: event.eventId as string,
        eventType: event.eventType as string,
        payload: event.payload as Record<string, unknown>
      }
    })
  }
}
