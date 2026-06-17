export class ReadModelRepositoryPort {
  async hasProcessed(_eventId) {
    throw new Error("Method hasProcessed not implemented.")
  }

  async applyProductCreated(_event) {
    throw new Error("Method applyProductCreated not implemented.")
  }

  async applyStockAdded(_event) {
    throw new Error("Method applyStockAdded not implemented.")
  }

  async applySaleCompleted(_event) {
    throw new Error("Method applySaleCompleted not implemented.")
  }

  async applyStockTransferred(_event) {
    throw new Error("Method applyStockTransferred not implemented.")
  }
}
