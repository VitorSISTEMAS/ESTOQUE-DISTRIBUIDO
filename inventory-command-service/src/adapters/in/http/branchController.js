export function createBranchController(createBranchUseCase) {
  return async function (req, res, next) {
    try {
      const branch = await createBranchUseCase.execute(req.body)
      res.status(201).json(branch)
    } catch (error) {
      next(error)
    }
  }
}

export function listBranchesController(listBranchesUseCase) {
  return async function (_req, res, next) {
    try {
      const branches = await listBranchesUseCase.execute()
      res.json(branches)
    } catch (error) {
      next(error)
    }
  }
}
