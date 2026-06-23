import { Request, Response, NextFunction } from "express"
import { CreateBranchUseCase } from "../../../application/use-cases/CreateBranchUseCase.js"
import { ListBranchesUseCase } from "../../../application/use-cases/ListBranchesUseCase.js"

export function createBranchController(createBranchUseCase: CreateBranchUseCase) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branch = await createBranchUseCase.execute(req.body)
      res.status(201).json(branch)
    } catch (error) {
      next(error)
    }
  }
}

export function listBranchesController(listBranchesUseCase: ListBranchesUseCase) {
  return async function (_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branches = await listBranchesUseCase.execute()
      res.json(branches)
    } catch (error) {
      next(error)
    }
  }
}
