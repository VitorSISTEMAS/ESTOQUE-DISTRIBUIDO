import { ProductReadModel } from "../../domain/entities/ProductReadModel.js"

export class ListProductsUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository
  }

  async execute() {
    const products = await this.readRepository.listProducts()
    return products.map(p => new ProductReadModel(p))
  }
}
