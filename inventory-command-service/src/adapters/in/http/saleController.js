import { container } from "../../../config/container.js";

export async function registerSale(req, res, next) {
  try {
    const result = await container.registerSaleUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
