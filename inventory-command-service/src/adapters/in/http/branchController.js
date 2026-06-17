import { container } from "../../../config/container.js"

export async function createBranch(req, res, next) {
  try {
    const branch = await container.createBranchUseCase.execute(req.body)
    res.status(201).json(branch)
  } catch (error) {
    next(error)
  }
}

export async function listBranches(_req, res, next) {
  try {
    const branches = await container.listBranchesUseCase.execute()
    res.json(branches)
  } catch (error) {
    next(error)
  }
}
