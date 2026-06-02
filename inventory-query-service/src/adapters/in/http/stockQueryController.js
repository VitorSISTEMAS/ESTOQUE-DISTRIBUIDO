import { container } from "../../../config/container.js";

export async function listStock(_req, res, next) {
  try {
    res.json(await container.getStockUseCase.execute());
  } catch (error) {
    next(error);
  }
}

export async function listStockByBranch(req, res, next) {
  try {
    res.json(await container.getStockByBranchUseCase.execute(req.params.branch));
  } catch (error) {
    next(error);
  }
}
