export class ListProductsUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository;
  }

  async execute() {
    return this.readRepository.listProducts();
  }
}
