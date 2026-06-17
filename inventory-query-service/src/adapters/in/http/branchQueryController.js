import { container } from "../../../config/container.js"

export async function listBranches(_req, res, next) {
  try {
    res.json(await container.listBranchesUseCase.execute())
  } catch (error) {
    next(error)
  }
}
