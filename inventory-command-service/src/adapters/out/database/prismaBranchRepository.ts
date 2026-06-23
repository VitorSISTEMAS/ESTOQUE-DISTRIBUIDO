import { prisma } from "./prismaClient.js"

interface BranchCreateData {
  name: string
  address?: string | null
}

export class PrismaBranchRepository {
  async findByName(name: string): Promise<any> {
    return prisma.branch.findUnique({ where: { name } })
  }

  async create(data: BranchCreateData): Promise<any> {
    return prisma.branch.create({ data })
  }

  async listAll(): Promise<any> {
    return prisma.branch.findMany({ orderBy: { name: "asc" } })
  }
}
