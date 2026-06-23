export class InsufficientStockError extends Error {
  statusCode: number

  constructor(branch: string, available: number, requested: number) {
    super(`Estoque insuficiente em ${branch}. Disponivel: ${available}. Solicitado: ${requested}.`)
    this.name = "InsufficientStockError"
    this.statusCode = 409
  }
}
