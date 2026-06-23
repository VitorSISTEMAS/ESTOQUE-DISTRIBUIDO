import { Request, Response, NextFunction } from "express"
import { AddStockUseCase } from "../../../application/use-cases/AddStockUseCase.js"

export function addStockController(addStockUseCase: AddStockUseCase) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await addStockUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}
