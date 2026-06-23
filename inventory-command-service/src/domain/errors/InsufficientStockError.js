export class InsufficientStockError extends Error {
  constructor(branch, available, requested) {
    super(`Estoque insuficiente em ${branch}. Disponivel: ${available}. Solicitado: ${requested}.`);
    this.name = "InsufficientStockError"
    this.statusCode = 409
  }
}
