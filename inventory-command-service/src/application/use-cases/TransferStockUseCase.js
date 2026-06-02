import { randomUUID } from "node:crypto";
import { Stock } from "../../domain/entities/Stock.js";

export class TransferStockUseCase {
  constructor(productRepository, stockRepository, eventPublisher) {
    this.productRepository = productRepository;
    this.stockRepository = stockRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(input) {
    Stock.validateBranch(input.sourceBranch);
    Stock.validateBranch(input.targetBranch);
    if (input.sourceBranch === input.targetBranch) {
      throw new Error("Filial de origem e destino devem ser diferentes.");
    }

    const quantity = Stock.validateQuantity(input.quantity);
    const product = await this.productRepository.findById(input.productId);
    if (!product) throw new Error("Produto nao encontrado.");

    const result = await this.stockRepository.transferStock({
      productId: input.productId,
      sourceBranch: input.sourceBranch,
      targetBranch: input.targetBranch,
      quantity
    });

    await this.eventPublisher.publish("stock.transferred", {
      eventId: randomUUID(),
      eventType: "STOCK_TRANSFERRED",
      occurredAt: new Date().toISOString(),
      payload: {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        sourceBranch: input.sourceBranch,
        targetBranch: input.targetBranch,
        quantity
      }
    });

    return result;
  }
}
