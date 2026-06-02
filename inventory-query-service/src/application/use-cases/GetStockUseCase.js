export class GetStockUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository;
  }

  async execute() {
    return this.readRepository.listStock();
  }
}
