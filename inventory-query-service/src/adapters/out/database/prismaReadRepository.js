import { prisma } from "./prismaClient.js";

export class PrismaReadRepository {
  async listProducts() {
    return prisma.productReadModel.findMany({ orderBy: { createdAt: "desc" } });
  }

  async listStock() {
    return prisma.stockReadModel.findMany({
      orderBy: [{ branch: "asc" }, { productName: "asc" }]
    });
  }

  async listStockByBranch(branch) {
    return prisma.stockReadModel.findMany({
      where: { branch },
      orderBy: { productName: "asc" }
    });
  }

  async listMovements() {
    return prisma.movementReadModel.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });
  }

  async listEvents() {
    return prisma.processedEvent.findMany({
      orderBy: { processedAt: "desc" },
      take: 100
    });
  }
}
