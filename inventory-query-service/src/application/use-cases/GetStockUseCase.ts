import { ReadRepositoryPort } from "../ports/ReadRepositoryPort.js"
import { StockReadModel } from "../../domain/entities/StockReadModel.js"

interface StockFilters {
  productName?: string
  stockTypeId?: number
}

export class GetStockUseCase {
  private readRepository: ReadRepositoryPort

  constructor(readRepository: ReadRepositoryPort) {
    this.readRepository = readRepository
  }

  async execute(filters: StockFilters = {}): Promise<StockReadModel[]> {
    const records = await this.readRepository.listStock(filters)
    return records.map(r => new StockReadModel(r))
  }
}
