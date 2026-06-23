import { Request, Response, NextFunction } from "express"
import { TransferStockUseCase } from "../../../application/use-cases/TransferStockUseCase.js"

export function transferStockController(transferStockUseCase: TransferStockUseCase) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await transferStockUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}
