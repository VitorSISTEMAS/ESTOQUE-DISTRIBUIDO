import { container } from "../../../config/container.js";

export async function transferStock(req, res, next) {
  try {
    const result = await container.transferStockUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
