import { Product } from "../../domain/entities/Product.js"

export class ProductCreatedHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository
  }

  async handle(event) {
    new Product(event.payload)
    await this.readModelRepository.applyProductCreated(event)
  }
}
