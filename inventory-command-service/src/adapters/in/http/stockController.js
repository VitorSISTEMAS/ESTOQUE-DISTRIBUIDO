export function addStockController(addStockUseCase) {
  return async function (req, res, next) {
    try {
      const result = await addStockUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}
