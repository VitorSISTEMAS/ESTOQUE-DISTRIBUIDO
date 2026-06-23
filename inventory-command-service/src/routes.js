import { Router } from "express"
import { container } from "./config/container.js"
import { createProductController } from "./adapters/in/http/productController.js"
import { addStockController } from "./adapters/in/http/stockController.js"
import { registerSaleController } from "./adapters/in/http/saleController.js"
import { transferStockController } from "./adapters/in/http/transferController.js"
import { createBranchController, listBranchesController } from "./adapters/in/http/branchController.js"

export const routes = Router()

routes.get("/health", (_req, res) => res.json({ service: "inventory-command-service", status: "ok" }))
routes.post("/products", createProductController(container.createProductUseCase))
routes.post("/stock/in", addStockController(container.addStockUseCase))
routes.post("/sales", registerSaleController(container.registerSaleUseCase))
routes.post("/transfers", transferStockController(container.transferStockUseCase))
routes.post("/branches", createBranchController(container.createBranchUseCase))
routes.get("/branches", listBranchesController(container.listBranchesUseCase))
