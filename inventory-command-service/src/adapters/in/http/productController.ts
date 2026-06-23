import { Request, Response, NextFunction } from "express"
import { CreateProductUseCase } from "../../../application/use-cases/CreateProductUseCase.js"

export function createProductController(createProductUseCase: CreateProductUseCase) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await createProductUseCase.execute(req.body)
      res.status(201).json(product)
    } catch (error) {
      next(error)
    }
  }
}
