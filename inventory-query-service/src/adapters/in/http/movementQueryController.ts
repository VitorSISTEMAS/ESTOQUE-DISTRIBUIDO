import { Request, Response, NextFunction } from "express"
import { ListMovementsUseCase } from "../../../application/use-cases/ListMovementsUseCase.js"

interface MovementQueryParams {
  productName?: string
  stockTypeId?: string
  startDate?: string
  endDate?: string
}

export function listMovementsController(listMovementsUseCase: ListMovementsUseCase) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const { productName, stockTypeId, startDate, endDate } = req.query as MovementQueryParams
      const filters: Record<string, any> = {}
      if (productName) filters.productName = productName
      if (stockTypeId) filters.stockTypeId = stockTypeId
      if (startDate) filters.startDate = startDate
      if (endDate) filters.endDate = endDate
      res.json(await listMovementsUseCase.execute(filters))
    } catch (error) {
      next(error)
    }
  }
}
