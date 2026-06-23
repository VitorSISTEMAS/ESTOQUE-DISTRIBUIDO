export function registerSaleController(registerSaleUseCase) {
  return async function (req, res, next) {
    try {
      const result = await registerSaleUseCase.execute(req.body)
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }
}
