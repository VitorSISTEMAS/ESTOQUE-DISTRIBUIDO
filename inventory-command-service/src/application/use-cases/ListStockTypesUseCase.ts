import { StockTypeRepositoryPort } from "../ports/StockTypeRepositoryPort.js"

export class ListStockTypesUseCase {
  private stockTypeRepository: StockTypeRepositoryPort

  constructor(stockTypeRepository: StockTypeRepositoryPort) {
    this.stockTypeRepository = stockTypeRepository
  }

  async execute(): Promise<any> {
    return this.stockTypeRepository.listAll()
  }
}
