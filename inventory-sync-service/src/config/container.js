import { ProductCreatedHandler } from "../application/handlers/ProductCreatedHandler.js";
import { SaleCompletedHandler } from "../application/handlers/SaleCompletedHandler.js";
import { StockAddedHandler } from "../application/handlers/StockAddedHandler.js";
import { StockTransferredHandler } from "../application/handlers/StockTransferredHandler.js";
import { BranchCreatedHandler } from "../application/handlers/BranchCreatedHandler.js";
import { PrismaReadModelRepository } from "../adapters/out/database/prismaReadModelRepository.js";

const readModelRepository = new PrismaReadModelRepository();

export const container = {
  readModelRepository,
  handlers: {
    PRODUCT_CREATED: new ProductCreatedHandler(readModelRepository),
    STOCK_ADDED: new StockAddedHandler(readModelRepository),
    SALE_COMPLETED: new SaleCompletedHandler(readModelRepository),
    STOCK_TRANSFERRED: new StockTransferredHandler(readModelRepository),
    BRANCH_CREATED: new BranchCreatedHandler(readModelRepository)
  }
};
