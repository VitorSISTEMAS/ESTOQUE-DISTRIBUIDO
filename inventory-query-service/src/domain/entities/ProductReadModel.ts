interface ProductReadModelInput {
  id?: string
  name: string
  sku: string
  description?: string | null
  stockTypeId?: number | null
  createdAt: string | Date
}

export class ProductReadModel {
  id?: string
  name: string
  sku: string
  description: string | null
  stockTypeId: number | null
  createdAt: Date

  constructor({ id, name, sku, description = null, stockTypeId = null, createdAt }: ProductReadModelInput) {
    if (!name?.trim()) throw new Error("Product name is required")
    if (!sku?.trim()) throw new Error("Product SKU is required")

    this.id = id
    this.name = name.trim()
    this.sku = sku.trim().toUpperCase()
    this.description = description?.trim() || null
    this.stockTypeId = stockTypeId ? Number(stockTypeId) : null
    this.createdAt = new Date(createdAt)
  }
}
