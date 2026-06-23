import { randomUUID } from "node:crypto"
import { Product } from "../../domain/entities/Product.js"
import { MOVEMENT_TYPES } from "../../domain/entities/StockMovement.js"
import { ProductRepositoryPort } from "../ports/ProductRepositoryPort.js"
import { StockTypeRepositoryPort } from "../ports/StockTypeRepositoryPort.js"
import { StockRepositoryPort } from "../ports/StockRepositoryPort.js"
import { EventPublisherPort } from "../ports/EventPublisherPort.js"

interface CreateProductInput {
  name: string
  sku: string
  description?: string | null
  stockTypeId?: number | null
}

export class CreateProductUseCase {
  private productRepository: ProductRepositoryPort
  private stockTypeRepository: StockTypeRepositoryPort
  private stockRepository: StockRepositoryPort
  private eventPublisher: EventPublisherPort

  constructor(
    productRepository: ProductRepositoryPort,
    stockTypeRepository: StockTypeRepositoryPort,
    stockRepository: StockRepositoryPort,
    eventPublisher: EventPublisherPort
  ) {
    this.productRepository = productRepository
    this.stockTypeRepository = stockTypeRepository
    this.stockRepository = stockRepository
    this.eventPublisher = eventPublisher
  }

  async execute(input: CreateProductInput): Promise<any> {
    if (input.stockTypeId) {
      const stockType = await this.stockTypeRepository.findById(input.stockTypeId)
      if (!stockType) throw new Error("Tipo de estoque invalido.")
    }

    const product = new Product(input)
    const created = await this.productRepository.create(product)

    await this.stockRepository.createMovement({
      productId: created.id,
      type: MOVEMENT_TYPES.CREATE,
      quantity: 0
    })

    await this.eventPublisher.publish("product.created", {
      eventId: randomUUID(),
      eventType: "PRODUCT_CREATED",
      occurredAt: new Date().toISOString(),
      payload: {
        productId: created.id,
        name: created.name,
        sku: created.sku,
        description: created.description,
        stockTypeId: created.stockTypeId,
        createdAt: created.createdAt
      }
    })

    return created
  }
}
