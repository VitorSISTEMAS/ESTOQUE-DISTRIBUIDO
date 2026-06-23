export function listProductsController(listProductsUseCase) {
  return async function (_req, res, next) {
    try {
      res.json(await listProductsUseCase.execute())
    } catch (error) {
      next(error)
    }
  }
}
