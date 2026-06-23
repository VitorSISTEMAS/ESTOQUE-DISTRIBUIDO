import { Product } from "../../domain/entities/Product.js"
import { ReadModelRepositoryPort } from "../ports/ReadModelRepositoryPort.js"

export class ProductCreatedHandler {
  private readModelRepository: ReadModelRepositoryPort

  constructor(readModelRepository: ReadModelRepositoryPort) {
    this.readModelRepository = readModelRepository
  }

  async handle(event: Record<string, unknown>): Promise<void> {
    new Product(event.payload as Record<string, unknown>)
    await this.readModelRepository.applyProductCreated(event)
  }
}
