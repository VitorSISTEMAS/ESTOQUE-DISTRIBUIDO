import { randomUUID } from "node:crypto";
import { Stock } from "../../domain/entities/Stock.js";

export class AddStockUseCase {
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

    const result = await this.stockRepository.addStock({
      productId: input.productId,
      branch: input.branch,
      quantity
    });

    await this.eventPublisher.publish("stock.added", {
      eventId: randomUUID(),
      eventType: "STOCK_ADDED",
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
