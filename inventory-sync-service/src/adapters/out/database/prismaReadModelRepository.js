import { MOVEMENT_TYPES } from "../../../domain/entities/StockMovement.js"
import { ProcessedEvent } from "../../../domain/entities/ProcessedEvent.js"
import { prisma } from "./prismaClient.js"

export class PrismaReadModelRepository {
  async hasProcessed(eventId) {
    return prisma.processedEvent.findUnique({ where: { eventId } })
  }

  async applyProductCreated(event) {
    const { payload } = event
    return prisma.$transaction(async (tx) => {
      await tx.productReadModel.upsert({
        where: { id: payload.productId },
        create: {
          id: payload.productId,
          name: payload.name,
          sku: payload.sku,
          description: payload.description,
          stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null,
          createdAt: new Date(payload.createdAt || event.occurredAt)
        },
        update: {
          name: payload.name,
          sku: payload.sku,
          description: payload.description,
          stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null
        }
      })

      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.CREATE,
          quantity: 0
        })
      })

      await this.recordProcessed(tx, event)
    })
  }

  async applyStockAdded(event) {
    const { payload } = event
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event)
      await this.incrementStock(tx, payload, payload.branch, payload.quantity)
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.IN,
          branch: payload.branch,
          quantity: payload.quantity
        })
      })
      await this.recordProcessed(tx, event)
    })
  }

  async applySaleCompleted(event) {
    const { payload } = event
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event)
      await this.incrementStock(tx, payload, payload.branch, -payload.quantity)
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.SALE,
          branch: payload.branch,
          quantity: payload.quantity
        })
      })
      await this.recordProcessed(tx, event)
    })
  }

  async applyStockTransferred(event) {
    const { payload } = event
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event)
      await this.incrementStock(tx, payload, payload.sourceBranch, -payload.quantity)
      await this.incrementStock(tx, payload, payload.targetBranch, payload.quantity)
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.TRANSFER_OUT,
          branch: payload.sourceBranch,
          sourceBranch: payload.sourceBranch,
          targetBranch: payload.targetBranch,
          quantity: payload.quantity
        })
      })
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: MOVEMENT_TYPES.TRANSFER_IN,
          branch: payload.targetBranch,
          sourceBranch: payload.sourceBranch,
          targetBranch: payload.targetBranch,
          quantity: payload.quantity
        })
      })
      await this.recordProcessed(tx, event)
    })
  }

  async ensureProduct(tx, payload, event) {
    await tx.productReadModel.upsert({
      where: { id: payload.productId },
      create: {
        id: payload.productId,
        name: payload.productName || payload.name,
        sku: payload.sku,
        description: payload.description || null,
        stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null,
        createdAt: new Date(event.occurredAt)
      },
      update: {
        name: payload.productName || payload.name,
        sku: payload.sku,
        stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null
      }
    })
  }

  async incrementStock(tx, payload, branch, quantityChange) {
    await tx.stockReadModel.upsert({
      where: { productId_branch: { productId: payload.productId, branch } },
      create: {
        productId: payload.productId,
        productName: payload.productName || payload.name,
        sku: payload.sku,
        branch,
        quantity: quantityChange,
        stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null,
        stockTypeName: payload.stockTypeName || null
      },
      update: {
        productName: payload.productName || payload.name,
        sku: payload.sku,
        quantity: { increment: quantityChange },
        stockTypeId: payload.stockTypeId ? Number(payload.stockTypeId) : null,
        stockTypeName: payload.stockTypeName || null
      }
    })
  }

  buildMovement(event, data) {
    const { payload } = event
    const stockTypeId = payload.stockTypeId ? Number(payload.stockTypeId) : null
    const stockTypeName = payload.stockTypeName || null
    return {
      productId: payload.productId,
      productName: payload.productName || payload.name,
      sku: payload.sku,
      type: data.type,
      branch: data.branch || null,
      sourceBranch: data.sourceBranch || null,
      targetBranch: data.targetBranch || null,
      quantity: data.quantity,
      stockTypeId,
      stockTypeName,
      createdAt: new Date(event.occurredAt)
    }
  }

  async applyBranchCreated(event) {
    const { payload } = event
    return prisma.$transaction(async (tx) => {
      await tx.branch.upsert({
        where: { name: payload.name },
        create: {
          id: payload.id,
          name: payload.name,
          address: payload.address || null
        },
        update: {
          address: payload.address || null
        }
      })
      await this.recordProcessed(tx, event)
    })
  }

  async recordProcessed(tx, event) {
    new ProcessedEvent({
      eventId: event.eventId,
      eventType: event.eventType,
      payload: event.payload
    })

    await tx.processedEvent.create({
      data: {
        eventId: event.eventId,
        eventType: event.eventType,
        payload: event.payload
      }
    })
  }
}
