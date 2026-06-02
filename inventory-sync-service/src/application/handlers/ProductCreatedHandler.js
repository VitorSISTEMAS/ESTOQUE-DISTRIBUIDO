export class ProductCreatedHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository;
  }

  async handle(event) {
    await this.readModelRepository.applyProductCreated(event);
  }
}
