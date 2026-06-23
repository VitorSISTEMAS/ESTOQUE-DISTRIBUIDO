import { Request, Response, NextFunction } from "express"
import { ListBranchesUseCase } from "../../../application/use-cases/ListBranchesUseCase.js"

export function listBranchesController(listBranchesUseCase: ListBranchesUseCase) {
  return async function (_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await listBranchesUseCase.execute())
    } catch (error) {
      next(error)
    }
  }
}
