import { container } from "../../../config/container.js";

export async function createProduct(req, res, next) {
  try {
    const product = await container.createProductUseCase.execute(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}
