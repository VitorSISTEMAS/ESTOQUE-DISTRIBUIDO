import { MOVEMENT_TYPES } from "../../../domain/entities/StockMovement.js"
import { InsufficientStockError } from "../../../domain/errors/InsufficientStockError.js"
import { prisma } from "./prismaClient.js"

interface AddStockParams { productId: string; branch: string; quantity: number }
interface SaleParams { productId: string; branch: string; quantity: number }
interface TransferParams { productId: string; sourceBranch: string; targetBranch: string; quantity: number }
interface MovementParams { productId: string; type: string; branch?: string | null; sourceBranch?: string | null; targetBranch?: string | null; quantity: number }

export class PrismaStockRepository {
  async addStock({ productId, branch, quantity }: AddStockParams): Promise<any> {
    return prisma.$transaction(async (tx: any) => {
      const stock = await tx.stock.upsert({
        where: { productId_branch: { productId, branch } },
        create: { productId, branch, quantity },
        update: { quantity: { increment: quantity } }
      })

      const movement = await tx.stockMovement.create({
        data: { productId, branch, type: MOVEMENT_TYPES.IN, quantity }
      })

      return { stock, movement }
    })
  }

  async registerSale({ productId, branch, quantity }: SaleParams): Promise<any> {
    return prisma.$transaction(async (tx: any) => {
      const current = await tx.stock.findUnique({
        where: { productId_branch: { productId, branch } }
      })

      if (!current || current.quantity < quantity) {
        throw new InsufficientStockError(branch, current?.quantity || 0, quantity)
      }

      const stock = await tx.stock.update({
        where: { productId_branch: { productId, branch } },
        data: { quantity: { decrement: quantity } }
      })

      const movement = await tx.stockMovement.create({
        data: { productId, branch, type: MOVEMENT_TYPES.SALE, quantity }
      })

      return { stock, movement }
    })
  }

  async transferStock({ productId, sourceBranch, targetBranch, quantity }: TransferParams): Promise<any> {
    return prisma.$transaction(async (tx: any) => {
      const source = await tx.stock.findUnique({
        where: { productId_branch: { productId, branch: sourceBranch } }
      })

      if (!source || source.quantity < quantity) {
        throw new InsufficientStockError(sourceBranch, source?.quantity || 0, quantity)
      }

      const sourceStock = await tx.stock.update({
        where: { productId_branch: { productId, branch: sourceBranch } },
        data: { quantity: { decrement: quantity } }
      })

      const targetStock = await tx.stock.upsert({
        where: { productId_branch: { productId, branch: targetBranch } },
        create: { productId, branch: targetBranch, quantity },
        update: { quantity: { increment: quantity } }
      })

      const movements = await Promise.all([
        tx.stockMovement.create({
          data: {
            productId,
            type: MOVEMENT_TYPES.TRANSFER_OUT,
            branch: sourceBranch,
            sourceBranch,
            targetBranch,
            quantity
          }
        }),
        tx.stockMovement.create({
          data: {
            productId,
            type: MOVEMENT_TYPES.TRANSFER_IN,
            branch: targetBranch,
            sourceBranch,
            targetBranch,
            quantity
          }
        })
      ])

      return { sourceStock, targetStock, movements }
    })
  }

  async createMovement({ productId, type, branch = null, sourceBranch = null, targetBranch = null, quantity }: MovementParams): Promise<any> {
    return prisma.stockMovement.create({
      data: { productId, type, branch, sourceBranch, targetBranch, quantity }
    })
  }
}
