import { container } from "../../../config/container.js";

export async function listProducts(_req, res, next) {
  try {
    res.json(await container.listProductsUseCase.execute());
  } catch (error) {
    next(error);
  }
}
