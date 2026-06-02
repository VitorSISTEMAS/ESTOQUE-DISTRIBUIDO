import { randomUUID } from "node:crypto";
import { Product } from "../../domain/entities/Product.js";

export class CreateProductUseCase {
  constructor(productRepository, eventPublisher) {
    this.productRepository = productRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(input) {
    const product = new Product(input);
    const created = await this.productRepository.create(product);

    await this.eventPublisher.publish("product.created", {
      eventId: randomUUID(),
      eventType: "PRODUCT_CREATED",
      occurredAt: new Date().toISOString(),
      payload: {
        productId: created.id,
        name: created.name,
        sku: created.sku,
        description: created.description,
        createdAt: created.createdAt
      }
    });

    return created;
  }
}
