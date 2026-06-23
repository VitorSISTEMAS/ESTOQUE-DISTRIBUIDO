import { Request, Response, NextFunction } from "express"
import { ListEventsUseCase } from "../../../application/use-cases/ListEventsUseCase.js"

export function listEventsController(listEventsUseCase: ListEventsUseCase) {
  return async function (_req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await listEventsUseCase.execute())
    } catch (error) {
      next(error)
    }
  }
}
