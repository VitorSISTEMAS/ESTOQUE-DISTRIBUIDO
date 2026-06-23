import { randomUUID } from "node:crypto"
import { Stock } from "../../domain/entities/Stock.js"
import { ProductRepositoryPort } from "../ports/ProductRepositoryPort.js"
import { BranchRepositoryPort } from "../ports/BranchRepositoryPort.js"
import { StockRepositoryPort } from "../ports/StockRepositoryPort.js"
import { EventPublisherPort } from "../ports/EventPublisherPort.js"

interface RegisterSaleInput {
  productId: string
  branch: string
  quantity: number
}

export class RegisterSaleUseCase {
  private productRepository: ProductRepositoryPort
  private branchRepository: BranchRepositoryPort
  private stockRepository: StockRepositoryPort
  private eventPublisher: EventPublisherPort

  constructor(
    productRepository: ProductRepositoryPort,
    branchRepository: BranchRepositoryPort,
    stockRepository: StockRepositoryPort,
    eventPublisher: EventPublisherPort
  ) {
    this.productRepository = productRepository
    this.branchRepository = branchRepository
    this.stockRepository = stockRepository
    this.eventPublisher = eventPublisher
  }

  async execute(input: RegisterSaleInput): Promise<any> {
    const branch = await this.branchRepository.findByName(input.branch)
    if (!branch) throw new Error(`Filial "${input.branch}" nao encontrada.`)

    const quantity = Stock.validateQuantity(input.quantity)
    const product = await this.productRepository.findById(input.productId)
    if (!product) throw new Error("Produto nao encontrado.")

    const result = await this.stockRepository.registerSale({
      productId: input.productId,
      branch: input.branch,
      quantity
    })

    await this.eventPublisher.publish("sale.completed", {
      eventId: randomUUID(),
      eventType: "SALE_COMPLETED",
      occurredAt: new Date().toISOString(),
      payload: {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        branch: input.branch,
        quantity,
        stockTypeId: product.stockTypeId
      }
    })

    return result
  }
}
