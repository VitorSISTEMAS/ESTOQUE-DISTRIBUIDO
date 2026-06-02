import { prisma } from "./prismaClient.js";

export class PrismaReadModelRepository {
  async hasProcessed(eventId) {
    return prisma.processedEvent.findUnique({ where: { eventId } });
  }

  async applyProductCreated(event) {
    const { payload } = event;
    return prisma.$transaction(async (tx) => {
      await tx.productReadModel.upsert({
        where: { id: payload.productId },
        create: {
          id: payload.productId,
          name: payload.name,
          sku: payload.sku,
          description: payload.description,
          createdAt: new Date(payload.createdAt || event.occurredAt)
        },
        update: {
          name: payload.name,
          sku: payload.sku,
          description: payload.description
        }
      });

      await this.recordProcessed(tx, event);
    });
  }

  async applyStockAdded(event) {
    const { payload } = event;
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event);
      await this.incrementStock(tx, payload, payload.branch, payload.quantity);
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: "IN",
          branch: payload.branch,
          quantity: payload.quantity
        })
      });
      await this.recordProcessed(tx, event);
    });
  }

  async applySaleCompleted(event) {
    const { payload } = event;
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event);
      await this.incrementStock(tx, payload, payload.branch, -payload.quantity);
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: "SALE",
          branch: payload.branch,
          quantity: payload.quantity
        })
      });
      await this.recordProcessed(tx, event);
    });
  }

  async applyStockTransferred(event) {
    const { payload } = event;
    return prisma.$transaction(async (tx) => {
      await this.ensureProduct(tx, payload, event);
      await this.incrementStock(tx, payload, payload.sourceBranch, -payload.quantity);
      await this.incrementStock(tx, payload, payload.targetBranch, payload.quantity);
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: "TRANSFER_OUT",
          branch: payload.sourceBranch,
          sourceBranch: payload.sourceBranch,
          targetBranch: payload.targetBranch,
          quantity: payload.quantity
        })
      });
      await tx.movementReadModel.create({
        data: this.buildMovement(event, {
          type: "TRANSFER_IN",
          branch: payload.targetBranch,
          sourceBranch: payload.sourceBranch,
          targetBranch: payload.targetBranch,
          quantity: payload.quantity
        })
      });
      await this.recordProcessed(tx, event);
    });
  }

  async ensureProduct(tx, payload, event) {
    await tx.productReadModel.upsert({
      where: { id: payload.productId },
      create: {
        id: payload.productId,
        name: payload.productName || payload.name,
        sku: payload.sku,
        description: payload.description || null,
        createdAt: new Date(event.occurredAt)
      },
      update: {
        name: payload.productName || payload.name,
        sku: payload.sku
      }
    });
  }

  async incrementStock(tx, payload, branch, quantityChange) {
    await tx.stockReadModel.upsert({
      where: { productId_branch: { productId: payload.productId, branch } },
      create: {
        productId: payload.productId,
        productName: payload.productName || payload.name,
        sku: payload.sku,
        branch,
        quantity: quantityChange
      },
      update: {
        productName: payload.productName || payload.name,
        sku: payload.sku,
        quantity: { increment: quantityChange }
      }
    });
  }

  buildMovement(event, data) {
    const { payload } = event;
    return {
      productId: payload.productId,
      productName: payload.productName || payload.name,
      sku: payload.sku,
      type: data.type,
      branch: data.branch || null,
      sourceBranch: data.sourceBranch || null,
      targetBranch: data.targetBranch || null,
      quantity: data.quantity,
      createdAt: new Date(event.occurredAt)
    };
  }

  async recordProcessed(tx, event) {
    await tx.processedEvent.create({
      data: {
        eventId: event.eventId,
        eventType: event.eventType,
        payload: event.payload
      }
    });
  }
}
