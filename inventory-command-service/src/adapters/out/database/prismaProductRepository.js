import { prisma } from "./prismaClient.js"

export class PrismaProductRepository {
  async create(product) {
    return prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        stockTypeId: product.stockTypeId
      }
    })
  }

  async findById(id) {
    return prisma.product.findUnique({
      where: { id },
      include: { stockType: true }
    })
  }
}
