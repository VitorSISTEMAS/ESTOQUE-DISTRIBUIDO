import { container } from "../../../config/container.js";

export async function listMovements(_req, res, next) {
  try {
    res.json(await container.listMovementsUseCase.execute());
  } catch (error) {
    next(error);
  }
}
