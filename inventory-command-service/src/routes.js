import { Router } from "express"
import { createProduct } from "./adapters/in/http/productController.js"
import { addStock } from "./adapters/in/http/stockController.js"
import { registerSale } from "./adapters/in/http/saleController.js"
import { transferStock } from "./adapters/in/http/transferController.js"
import { createBranch, listBranches } from "./adapters/in/http/branchController.js"
import { listStockTypes } from "./adapters/in/http/stockTypeController.js"

export const routes = Router()

routes.get("/health", (_req, res) => {
  res.json({ service: "inventory-command-service", status: "ok" })
})

routes.post("/products", createProduct)
routes.post("/stock/in", addStock)
routes.post("/sales", registerSale)
routes.post("/transfers", transferStock)
routes.post("/branches", createBranch)
routes.get("/branches", listBranches)
routes.get("/stock-types", listStockTypes)
