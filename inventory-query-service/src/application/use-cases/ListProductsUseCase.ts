import { ReadRepositoryPort } from "../ports/ReadRepositoryPort.js"
import { ProductReadModel } from "../../domain/entities/ProductReadModel.js"

export class ListProductsUseCase {
  private readRepository: ReadRepositoryPort

  constructor(readRepository: ReadRepositoryPort) {
    this.readRepository = readRepository
  }

  async execute(): Promise<ProductReadModel[]> {
    const products = await this.readRepository.listProducts()
    return products.map(p => new ProductReadModel(p))
  }
}
