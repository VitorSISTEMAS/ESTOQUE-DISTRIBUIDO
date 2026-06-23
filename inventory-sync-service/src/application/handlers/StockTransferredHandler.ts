import { Stock } from "../../domain/entities/Stock.js"
import { ReadModelRepositoryPort } from "../ports/ReadModelRepositoryPort.js"

export class StockTransferredHandler {
  private readModelRepository: ReadModelRepositoryPort

  constructor(readModelRepository: ReadModelRepositoryPort) {
    this.readModelRepository = readModelRepository
  }

  async handle(event: Record<string, unknown>): Promise<void> {
    const { payload } = event as { payload: Record<string, unknown> }
    Stock.validateQuantity(payload.quantity)
    await this.readModelRepository.applyStockTransferred(event)
  }
}
