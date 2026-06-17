import { AddStockUseCase } from "../application/use-cases/AddStockUseCase.js"
import { CreateProductUseCase } from "../application/use-cases/CreateProductUseCase.js"
import { RegisterSaleUseCase } from "../application/use-cases/RegisterSaleUseCase.js"
import { TransferStockUseCase } from "../application/use-cases/TransferStockUseCase.js"
import { CreateBranchUseCase } from "../application/use-cases/CreateBranchUseCase.js"
import { ListBranchesUseCase } from "../application/use-cases/ListBranchesUseCase.js"
import { ListStockTypesUseCase } from "../application/use-cases/ListStockTypesUseCase.js"
import { PrismaProductRepository } from "../adapters/out/database/prismaProductRepository.js"
import { PrismaStockRepository } from "../adapters/out/database/prismaStockRepository.js"
import { PrismaBranchRepository } from "../adapters/out/database/prismaBranchRepository.js"
import { PrismaStockTypeRepository } from "../adapters/out/database/prismaStockTypeRepository.js"
import { RabbitMQEventPublisher } from "../adapters/out/messaging/rabbitMQEventPublisher.js"

const productRepository = new PrismaProductRepository()
const stockRepository = new PrismaStockRepository()
const branchRepository = new PrismaBranchRepository()
const stockTypeRepository = new PrismaStockTypeRepository()
const eventPublisher = new RabbitMQEventPublisher()

export const container = {
  createProductUseCase: new CreateProductUseCase(productRepository, stockTypeRepository, stockRepository, eventPublisher),
  addStockUseCase: new AddStockUseCase(productRepository, branchRepository, stockRepository, eventPublisher),
  registerSaleUseCase: new RegisterSaleUseCase(productRepository, branchRepository, stockRepository, eventPublisher),
  transferStockUseCase: new TransferStockUseCase(productRepository, branchRepository, stockRepository, eventPublisher),
  createBranchUseCase: new CreateBranchUseCase(branchRepository, eventPublisher),
  listBranchesUseCase: new ListBranchesUseCase(branchRepository),
  listStockTypesUseCase: new ListStockTypesUseCase(stockTypeRepository)
}
