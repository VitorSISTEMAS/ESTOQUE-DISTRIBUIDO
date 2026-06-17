export class NotFoundError extends Error {
  constructor(entity, filter) {
    super(`${entity} not found: ${filter}`)
    this.name = "NotFoundError"
    this.statusCode = 404
  }
}
