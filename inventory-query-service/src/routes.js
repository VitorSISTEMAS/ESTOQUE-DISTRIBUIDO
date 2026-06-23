import { Router } from "express"
import { container } from "./config/container.js"
import { listProductsController } from "./adapters/in/http/productQueryController.js"
import { listStockController, listStockByBranchController } from "./adapters/in/http/stockQueryController.js"
import { listMovementsController } from "./adapters/in/http/movementQueryController.js"
import { listEventsController } from "./adapters/in/http/eventQueryController.js"
import { listBranchesController } from "./adapters/in/http/branchQueryController.js"
import { listStockTypesController } from "./adapters/in/http/stockTypeQueryController.js"

export const routes = Router()

routes.get("/health", (_req, res) => {
  res.json({ service: "inventory-query-service", status: "ok" })
})

routes.get("/products", listProductsController(container.listProductsUseCase))
routes.get("/stock", listStockController(container.getStockUseCase))
routes.get("/stock/:branch", listStockByBranchController(container.getStockByBranchUseCase))
routes.get("/movements", listMovementsController(container.listMovementsUseCase))
routes.get("/events", listEventsController(container.listEventsUseCase))
routes.get("/branches", listBranchesController(container.listBranchesUseCase))
routes.get("/stock-types", listStockTypesController(container.listStockTypesUseCase))
