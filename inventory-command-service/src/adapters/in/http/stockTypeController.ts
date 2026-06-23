import { Request, Response, NextFunction } from "express"
import { ListStockTypesUseCase } from "../../../application/use-cases/ListStockTypesUseCase.js"

export function listStockTypesController(listStockTypesUseCase: ListStockTypesUseCase) {
  return async function (_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const types = await listStockTypesUseCase.execute()
      res.json(types)
    } catch (error) {
      next(error)
    }
  }
}
