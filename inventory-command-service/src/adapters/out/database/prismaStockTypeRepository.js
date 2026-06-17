import { prisma } from "./prismaClient.js"

export class PrismaStockTypeRepository {
  async findById(id) {
    return prisma.stockType.findUnique({ where: { id: Number(id) } })
  }

  async listAll() {
    return prisma.stockType.findMany({ orderBy: { id: "asc" } })
  }
}
