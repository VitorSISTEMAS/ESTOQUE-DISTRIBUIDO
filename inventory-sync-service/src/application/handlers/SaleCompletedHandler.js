export class SaleCompletedHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }

  async handle(event) {
    await this.readModelRepository.applySaleCompleted(event);
  }
}
