import { StockReadModel } from "../../domain/entities/StockReadModel.js"

export class GetStockUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository
  }

  async execute(filters = {}) {
    const records = await this.readRepository.listStock(filters)
    return records.map(r => new StockReadModel(r))
  }
}
