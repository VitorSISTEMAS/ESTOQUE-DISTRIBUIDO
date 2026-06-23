import { Request, Response, NextFunction } from "express"
import { RegisterSaleUseCase } from "../../../application/use-cases/RegisterSaleUseCase.js"

export function registerSaleController(registerSaleUseCase: RegisterSaleUseCase) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await registerSaleUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}
