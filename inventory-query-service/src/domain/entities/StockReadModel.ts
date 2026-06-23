interface StockReadModelInput {
  id?: string
  productId: string
  productName: string
  sku: string
  branch: string
  quantity: number
  stockTypeId?: number | null
  stockTypeName?: string | null
  updatedAt: string | Date
}

export class StockReadModel {
  id?: string
  productId: string
  productName: string
  sku: string
  branch: string
  quantity: number
  stockTypeId: number | null
  stockTypeName: string | null
  updatedAt: Date

  constructor({ id, productId, productName, sku, branch, quantity, stockTypeId = null, stockTypeName = null, updatedAt }: StockReadModelInput) {
    this.id = id
    this.productId = productId
    this.productName = productName
    this.sku = sku
    this.branch = branch
    this.quantity = quantity
    this.stockTypeId = stockTypeId ? Number(stockTypeId) : null
    this.stockTypeName = stockTypeName || null
    this.updatedAt = new Date(updatedAt)
  }
}
