import { Router } from "express"
import { listEvents } from "./adapters/in/http/eventQueryController.js"
import { listMovements } from "./adapters/in/http/movementQueryController.js"
import { listProducts } from "./adapters/in/http/productQueryController.js"
import { listStock, listStockByBranch } from "./adapters/in/http/stockQueryController.js"
import { listBranches } from "./adapters/in/http/branchQueryController.js"
import { listStockTypes } from "./adapters/in/http/stockTypeQueryController.js"

export const routes = Router()

routes.get("/health", (_req, res) => {
  res.json({ service: "inventory-query-service", status: "ok" })
})

routes.get("/products", listProducts)
routes.get("/stock", listStock)
routes.get("/stock/:branch", listStockByBranch)
routes.get("/movements", listMovements)
routes.get("/events", listEvents)
routes.get("/branches", listBranches)
routes.get("/stock-types", listStockTypes)
