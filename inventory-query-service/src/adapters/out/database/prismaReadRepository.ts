import { prisma } from "./prismaClient.js"
import { ReadRepositoryPort } from "../../../application/ports/ReadRepositoryPort.js"

interface StockFilters {
  productName?: string
  stockTypeId?: number
}

interface MovementFilters {
  productName?: string
  stockTypeId?: number
  startDate?: string
  endDate?: string
}

export class PrismaReadRepository implements ReadRepositoryPort {
  async listProducts(): Promise<any[]> {
    return prisma.productReadModel.findMany({ orderBy: { createdAt: "desc" } })
  }

  async listStock(filters: StockFilters = {}): Promise<any[]> {
    const where: Record<string, any> = {}
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

  async listStockByBranch(branch: string): Promise<any[]> {
    return prisma.stockReadModel.findMany({
      where: { branch },
      orderBy: { productName: "asc" }
    })
  }

  async listMovements(filters: MovementFilters = {}): Promise<any[]> {
    const where: Record<string, any> = {}
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

  async listEvents(): Promise<any[]> {
    return prisma.processedEvent.findMany({
      orderBy: { processedAt: "desc" },
      take: 100
    })
  }

  async listBranches(): Promise<any[]> {
    return prisma.branch.findMany({ orderBy: { name: "asc" } })
  }

  async listStockTypes(): Promise<any[]> {
    return prisma.stockType.findMany({ orderBy: { id: "asc" } })
  }
}
