import { Product } from "../../../domain/entities/Product.js"
import { prisma } from "./prismaClient.js"

export class PrismaProductRepository {
  async create(product: Product): Promise<any> {
    return prisma.product.create({
      data: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        stockTypeId: product.stockTypeId
      }
    })
  }

  async findById(id: string): Promise<any> {
    return prisma.product.findUnique({
      where: { id },
      include: { stockType: true }
    })
  }
}
