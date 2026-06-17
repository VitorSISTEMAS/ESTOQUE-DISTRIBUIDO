import { Stock } from "../../domain/entities/Stock.js"

export class StockTransferredHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository
  }

  async handle(event) {
    const { payload } = event
    Stock.validateQuantity(payload.quantity)
    await this.readModelRepository.applyStockTransferred(event)
  }
}
