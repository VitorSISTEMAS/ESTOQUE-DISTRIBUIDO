export class StockTransferredHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }

  async handle(event) {
    await this.readModelRepository.applyStockTransferred(event);
  }
}
