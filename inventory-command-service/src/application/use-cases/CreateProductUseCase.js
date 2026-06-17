import { randomUUID } from "node:crypto"
import { Product } from "../../domain/entities/Product.js"
import { MOVEMENT_TYPES } from "../../domain/entities/StockMovement.js"

export class CreateProductUseCase {
  constructor(productRepository, stockTypeRepository, stockRepository, eventPublisher) {
    this.productRepository = productRepository
    this.stockTypeRepository = stockTypeRepository
    this.stockRepository = stockRepository
    this.eventPublisher = eventPublisher
  }

  async execute(input) {
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
