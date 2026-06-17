import { prisma } from "./prismaClient.js"

export class PrismaBranchRepository {
  async findByName(name) {
    return prisma.branch.findUnique({ where: { name } })
  }

  async create(data) {
    return prisma.branch.create({ data })
  }

  async listAll() {
    return prisma.branch.findMany({ orderBy: { name: "asc" } })
  }
}
