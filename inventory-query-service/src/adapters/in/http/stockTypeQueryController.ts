import { Request, Response, NextFunction } from "express"
import { ListStockTypesUseCase } from "../../../application/use-cases/ListStockTypesUseCase.js"

export function listStockTypesController(listStockTypesUseCase: ListStockTypesUseCase) {
  return async function (_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await listStockTypesUseCase.execute())
    } catch (error) {
      next(error)
    }
  }
}
