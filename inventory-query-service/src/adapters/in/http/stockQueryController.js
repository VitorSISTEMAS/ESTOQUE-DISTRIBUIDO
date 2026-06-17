import { container } from "../../../config/container.js"

export async function listStock(req, res, next) {
  try {
    const { productName, stockTypeId } = req.query
    const filters = {}
    if (productName) filters.productName = productName
    if (stockTypeId) filters.stockTypeId = stockTypeId
    res.json(await container.getStockUseCase.execute(filters))
  } catch (error) {
    next(error)
  }
}

export async function listStockByBranch(req, res, next) {
  try {
    const stock = await container.getStockByBranchUseCase.execute(req.params.branch)
    res.json(stock)
  } catch (error) {
    next(error)
  }
}
