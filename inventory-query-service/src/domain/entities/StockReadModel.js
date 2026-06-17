export class StockReadModel {
  constructor({ id, productId, productName, sku, branch, quantity, stockTypeId = null, stockTypeName = null, updatedAt }) {
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
