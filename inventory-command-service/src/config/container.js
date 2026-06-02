import { AddStockUseCase } from "../application/use-cases/AddStockUseCase.js";
import { CreateProductUseCase } from "../application/use-cases/CreateProductUseCase.js";
import { RegisterSaleUseCase } from "../application/use-cases/RegisterSaleUseCase.js";
import { TransferStockUseCase } from "../application/use-cases/TransferStockUseCase.js";
import { PrismaProductRepository } from "../adapters/out/database/prismaProductRepository.js";
import { PrismaStockRepository } from "../adapters/out/database/prismaStockRepository.js";
import { RabbitMQEventPublisher } from "../adapters/out/messaging/rabbitMQEventPublisher.js";

const productRepository = new PrismaProductRepository();
const stockRepository = new PrismaStockRepository();
const eventPublisher = new RabbitMQEventPublisher();

export const container = {
  createProductUseCase: new CreateProductUseCase(productRepository, eventPublisher),
  addStockUseCase: new AddStockUseCase(productRepository, stockRepository, eventPublisher),
  registerSaleUseCase: new RegisterSaleUseCase(productRepository, stockRepository, eventPublisher),
  transferStockUseCase: new TransferStockUseCase(productRepository, stockRepository, eventPublisher)
};
