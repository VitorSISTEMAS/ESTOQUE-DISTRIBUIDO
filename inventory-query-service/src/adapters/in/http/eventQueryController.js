export function listEventsController(listEventsUseCase) {
  return async function (_req, res, next) {
    try {
      res.json(await listEventsUseCase.execute())
    } catch (error) {
      next(error)
    }
  }
}
