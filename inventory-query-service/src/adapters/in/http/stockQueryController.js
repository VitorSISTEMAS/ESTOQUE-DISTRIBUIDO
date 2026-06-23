export function listStockController(getStockUseCase) {
  return async function (req, res, next) {
    try {
      const { productName, stockTypeId } = req.query
      const filters = {}
      if (productName) filters.productName = productName
      if (stockTypeId) filters.stockTypeId = stockTypeId
      res.json(await getStockUseCase.execute(filters))
    } catch (error) {
      next(error)
    }
  }
}

export function listStockByBranchController(getStockByBranchUseCase) {
  return async function (req, res, next) {
    try {
      const stock = await getStockByBranchUseCase.execute(req.params.branch)
      res.json(stock)
    } catch (error) {
      next(error)
    }
  }
}
