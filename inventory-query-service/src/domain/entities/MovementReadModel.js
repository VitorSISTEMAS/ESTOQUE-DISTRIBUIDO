export const MOVEMENT_TYPES = {
  CREATE: "CREATE",
  IN: "IN",
  SALE: "SALE",
  TRANSFER_OUT: "TRANSFER_OUT",
  TRANSFER_IN: "TRANSFER_IN"
}

export const MOVEMENT_DISPLAY = {
  CREATE: "Produto Criado",
  IN: "Entrada",
  SALE: "FAT",
  TRANSFER_OUT: "Envio",
  TRANSFER_IN: "Recebimento"
}

export class MovementReadModel {
  constructor({ id, productId, productName, sku, type, branch = null, sourceBranch = null, targetBranch = null, quantity, stockTypeId = null, stockTypeName = null, createdAt }) {
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
