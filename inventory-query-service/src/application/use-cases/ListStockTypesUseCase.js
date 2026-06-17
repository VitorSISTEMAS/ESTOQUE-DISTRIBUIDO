export class ListStockTypesUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository
  }

  async execute() {
    return this.readRepository.listStockTypes()
  }
}
