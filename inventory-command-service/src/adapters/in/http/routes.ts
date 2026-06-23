import { Router, Request, Response } from "express"
import { container } from "../../../config/container.js"
import { createProductController } from "./productController.js"
import { addStockController } from "./stockController.js"
import { registerSaleController } from "./saleController.js"
import { transferStockController } from "./transferController.js"
import { createBranchController, listBranchesController } from "./branchController.js"

export const routes = Router()

routes.get("/health", (_req: Request, res: Response) => res.json({ service: "inventory-command-service", status: "ok" }))
routes.post("/products", createProductController(container.createProductUseCase))
routes.post("/stock/in", addStockController(container.addStockUseCase))
routes.post("/sales", registerSaleController(container.registerSaleUseCase))
routes.post("/transfers", transferStockController(container.transferStockUseCase))
routes.post("/branches", createBranchController(container.createBranchUseCase))
routes.get("/branches", listBranchesController(container.listBranchesUseCase))
