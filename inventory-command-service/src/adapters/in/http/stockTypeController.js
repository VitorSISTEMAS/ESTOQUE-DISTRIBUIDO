import { container } from "../../../config/container.js"

export async function listStockTypes(_req, res, next) {
  try {
    const types = await container.listStockTypesUseCase.execute()
    res.json(types)
  } catch (error) {
    next(error)
  }
}
