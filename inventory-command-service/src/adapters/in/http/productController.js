export function createProductController(createProductUseCase) {
  return async function (req, res, next) {
    try {
      const product = await createProductUseCase.execute(req.body)
      res.status(201).json(product)
    } catch (error) {
      next(error)
    }
  }
}
