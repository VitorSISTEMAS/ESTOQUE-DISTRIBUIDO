export class ListStockTypesUseCase {
  constructor(stockTypeRepository) {
    this.stockTypeRepository = stockTypeRepository
  }

  async execute() {
    return this.stockTypeRepository.listAll()
  }
}
