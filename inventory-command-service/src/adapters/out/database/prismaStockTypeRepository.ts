import { prisma } from "./prismaClient.js"

export class PrismaStockTypeRepository {
  async findById(id: number | string): Promise<any> {
    return prisma.stockType.findUnique({ where: { id: Number(id) } })
  }

  async listAll(): Promise<any> {
    return prisma.stockType.findMany({ orderBy: { id: "asc" } })
  }
}
