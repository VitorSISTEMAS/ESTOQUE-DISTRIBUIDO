import { container } from "../../../config/container.js";

export async function addStock(req, res, next) {
  try {
    const result = await container.addStockUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
