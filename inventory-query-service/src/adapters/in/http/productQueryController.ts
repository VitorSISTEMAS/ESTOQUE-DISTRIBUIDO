import { Request, Response, NextFunction } from "express"
import { ListProductsUseCase } from "../../../application/use-cases/ListProductsUseCase.js"

export function listProductsController(listProductsUseCase: ListProductsUseCase) {
  return async function (_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await listProductsUseCase.execute())
    } catch (error) {
      next(error)
    }
  }
}
