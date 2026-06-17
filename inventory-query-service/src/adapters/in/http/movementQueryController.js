import { container } from "../../../config/container.js"

export async function listMovements(req, res, next) {
  try {
    const { productName, stockTypeId, startDate, endDate } = req.query
    const filters = {}
    if (productName) filters.productName = productName
    if (stockTypeId) filters.stockTypeId = stockTypeId
    if (startDate) filters.startDate = startDate
    if (endDate) filters.endDate = endDate
    res.json(await container.listMovementsUseCase.execute(filters))
  } catch (error) {
    next(error)
  }
}
