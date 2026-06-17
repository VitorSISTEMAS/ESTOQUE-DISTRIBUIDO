export class InsufficientStockError extends Error {
  constructor(branch, available, requested) {
    super(`Insufficient stock in ${branch}. Available: ${available}. Requested: ${requested}.`)
    this.name = "InsufficientStockError"
    this.statusCode = 409
  }
}
