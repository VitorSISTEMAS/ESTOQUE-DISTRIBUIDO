import { Request, Response, NextFunction } from "express"
import { GetStockUseCase } from "../../../application/use-cases/GetStockUseCase.js"
import { GetStockByBranchUseCase } from "../../../application/use-cases/GetStockByBranchUseCase.js"

interface StockQueryParams {
  productName?: string
  stockTypeId?: string
}

export function listStockController(getStockUseCase: GetStockUseCase) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { productName, stockTypeId } = req.query as StockQueryParams
      const filters: Record<string, any> = {}
      if (productName) filters.productName = productName
      if (stockTypeId) filters.stockTypeId = stockTypeId
      res.json(await getStockUseCase.execute(filters))
    } catch (error) {
      next(error)
    }
  }
}

export function listStockByBranchController(getStockByBranchUseCase: GetStockByBranchUseCase) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const stock = await getStockByBranchUseCase.execute(req.params.branch)
      res.json(stock)
    } catch (error) {
      next(error)
    }
  }
}
