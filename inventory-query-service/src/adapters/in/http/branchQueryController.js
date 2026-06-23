export function listBranchesController(listBranchesUseCase) {
  return async function (_req, res, next) {
    try {
      res.json(await listBranchesUseCase.execute())
    } catch (error) {
      next(error)
    }
  }
}
