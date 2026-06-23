export class InsufficientStockError extends Error {
  statusCode: number

  constructor(branch: string, available: number, requested: number) {
    super(`Insufficient stock in ${branch}. Available: ${available}. Requested: ${requested}.`)
    this.name = "InsufficientStockError"
    this.statusCode = 409
  }
}
