import { prisma } from "./prismaClient.js"

export class PrismaReadRepository {
  async listProducts() {
    return prisma.productReadModel.findMany({ orderBy: { createdAt: "desc" } })
  }

  async listStock(filters = {}) {
    const where = {}
    if (filters.productName) {
      where.productName = { contains: filters.productName, mode: "insensitive" }
    }
    if (filters.stockTypeId) {
      where.stockTypeId = Number(filters.stockTypeId)
    }
    return prisma.stockReadModel.findMany({
      where,
      orderBy: [{ branch: "asc" }, { productName: "asc" }]
    })
  }

  async listStockByBranch(branch) {
    return prisma.stockReadModel.findMany({
      where: { branch },
      orderBy: { productName: "asc" }
    })
  }

  async listMovements(filters = {}) {
    const where = {}
    if (filters.productName) {
      where.productName = { contains: filters.productName, mode: "insensitive" }
    }
    if (filters.stockTypeId) {
      where.stockTypeId = Number(filters.stockTypeId)
    }
    if (filters.startDate || filters.endDate) {
      where.createdAt = {}
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate)
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate)
    }
    return prisma.movementReadModel.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100
    })
  }

  async listEvents() {
    return prisma.processedEvent.findMany({
      orderBy: { processedAt: "desc" },
      take: 100
    })
  }

  async listBranches() {
    return prisma.branch.findMany({ orderBy: { name: "asc" } })
  }

  async listStockTypes() {
    return prisma.stockType.findMany({ orderBy: { id: "asc" } })
  }
}
