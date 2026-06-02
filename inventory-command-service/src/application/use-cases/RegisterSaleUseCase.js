import { randomUUID } from "node:crypto";
import { Stock } from "../../domain/entities/Stock.js";

export class RegisterSaleUseCase {
  constructor(productRepository, stockRepository, eventPublisher) {
    this.productRepository = productRepository;
    this.stockRepository = stockRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(input) {
    Stock.validateBranch(input.branch);
    const quantity = Stock.validateQuantity(input.quantity);
    const product = await this.productRepository.findById(input.productId);
    if (!product) throw new Error("Produto nao encontrado.");

    const result = await this.stockRepository.registerSale({
      productId: input.productId,
      branch: input.branch,
      quantity
    });

    await this.eventPublisher.publish("sale.completed", {
      eventId: randomUUID(),
      eventType: "SALE_COMPLETED",
      occurredAt: new Date().toISOString(),
      payload: {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        branch: input.branch,
        quantity
      }
    });

    return result;
  }
}
