import { Router, Request, Response } from "express"
import { container } from "../../../config/container.js"
import { listProductsController } from "./productQueryController.js"
import { listStockController, listStockByBranchController } from "./stockQueryController.js"
import { listMovementsController } from "./movementQueryController.js"
import { listEventsController } from "./eventQueryController.js"
import { listBranchesController } from "./branchQueryController.js"
import { listStockTypesController } from "./stockTypeQueryController.js"

export const routes = Router()

routes.get("/health", (_req: Request, res: Response) => {
  res.json({ service: "inventory-query-service", status: "ok" })
})

routes.get("/products", listProductsController(container.listProductsUseCase))
routes.get("/stock", listStockController(container.getStockUseCase))
routes.get("/stock/:branch", listStockByBranchController(container.getStockByBranchUseCase))
routes.get("/movements", listMovementsController(container.listMovementsUseCase))
routes.get("/events", listEventsController(container.listEventsUseCase))
routes.get("/branches", listBranchesController(container.listBranchesUseCase))
routes.get("/stock-types", listStockTypesController(container.listStockTypesUseCase))
