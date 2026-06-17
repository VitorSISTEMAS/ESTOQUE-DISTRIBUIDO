export class Product {
  constructor({ id, name, sku, description = null, stockTypeId = null, createdAt = new Date() }) {
    if (!name?.trim()) throw new Error("Nome do produto e obrigatorio.")
    if (!sku?.trim()) throw new Error("SKU do produto e obrigatorio.")

    this.id = id
    this.name = name.trim()
    this.sku = sku.trim().toUpperCase()
    this.description = description?.trim() || null
    this.stockTypeId = stockTypeId ? Number(stockTypeId) : null
    this.createdAt = createdAt
  }
}
