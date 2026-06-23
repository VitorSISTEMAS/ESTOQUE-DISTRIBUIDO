export function listStockTypesController(listStockTypesUseCase) {
  return async function (_req, res, next) {
    try {
      const types = await listStockTypesUseCase.execute()
      res.json(types)
    } catch (error) {
      next(error)
    }
  }
}
