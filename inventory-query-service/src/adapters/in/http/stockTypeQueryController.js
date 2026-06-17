import { container } from "../../../config/container.js"

export async function listStockTypes(_req, res, next) {
  try {
    res.json(await container.listStockTypesUseCase.execute())
  } catch (error) {
    next(error)
  }
}
