export function transferStockController(transferStockUseCase) {
  return async function (req, res, next) {
    try {
      const result = await transferStockUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}
