export function listMovementsController(listMovementsUseCase) {
  return async function (req, res, next) {
    try {
      const { productName, stockTypeId, startDate, endDate } = req.query
      const filters = {}
      if (productName) filters.productName = productName
      if (stockTypeId) filters.stockTypeId = stockTypeId
      if (startDate) filters.startDate = startDate
      if (endDate) filters.endDate = endDate
      res.json(await listMovementsUseCase.execute(filters))
    } catch (error) {
      next(error)
    }
  }
}
