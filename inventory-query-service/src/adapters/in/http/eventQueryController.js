import { container } from "../../../config/container.js";

export async function listEvents(_req, res, next) {
  try {
    res.json(await container.listEventsUseCase.execute());
  } catch (error) {
    next(error);
  }
}
