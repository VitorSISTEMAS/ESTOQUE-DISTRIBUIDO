export function listStockTypesController(listStockTypesUseCase) {
  return async function (_req, res, next) {
    try {
      res.json(await listStockTypesUseCase.execute())
    } catch (error) {
      next(error)
    }
  }
}
