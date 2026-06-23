export const MOVEMENT_TYPES: Record<string, string> = {
  CREATE: "CREATE",
  IN: "IN",
  SALE: "SALE",
  TRANSFER_OUT: "TRANSFER_OUT",
  TRANSFER_IN: "TRANSFER_IN"
}

export const MOVEMENT_DISPLAY: Record<string, string> = {
  CREATE: "Produto Criado",
  IN: "Entrada",
  SALE: "FAT",
  TRANSFER_OUT: "Envio",
  TRANSFER_IN: "Recebimento"
}

interface MovementReadModelInput {
  id?: string
  productId: string
  productName: string
  sku: string
  type: string
  branch?: string | null
  sourceBranch?: string | null
  targetBranch?: string | null
  quantity: number
  stockTypeId?: number | null
  stockTypeName?: string | null
  createdAt: string | Date
}

export class MovementReadModel {
  id?: string
  productId: string
  productName: string
  sku: string
  type: string
  displayType: string
  branch: string | null
  sourceBranch: string | null
  targetBranch: string | null
  quantity: number
  stockTypeId: number | null
  stockTypeName: string | null
  createdAt: Date

  constructor({ id, productId, productName, sku, type, branch = null, sourceBranch = null, targetBranch = null, quantity, stockTypeId = null, stockTypeName = null, createdAt }: MovementReadModelInput) {
    this.id = id
    this.productId = productId
    this.productName = productName
    this.sku = sku
    this.type = type
    this.displayType = MOVEMENT_DISPLAY[type] || type
    this.branch = branch
    this.sourceBranch = sourceBranch
    this.targetBranch = targetBranch
    this.quantity = quantity
    this.stockTypeId = stockTypeId ? Number(stockTypeId) : null
    this.stockTypeName = stockTypeName || null
    this.createdAt = new Date(createdAt)
  }
}
