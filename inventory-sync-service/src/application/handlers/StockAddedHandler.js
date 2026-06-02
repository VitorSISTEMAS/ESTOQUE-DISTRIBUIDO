export class StockAddedHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }

  async handle(event) {
    await this.readModelRepository.applyStockAdded(event);
  }
}
