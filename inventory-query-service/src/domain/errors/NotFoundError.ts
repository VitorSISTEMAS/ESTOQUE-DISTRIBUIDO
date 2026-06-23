export class NotFoundError extends Error {
  statusCode: number

  constructor(entity: string, filter: string) {
    super(`${entity} not found: ${filter}`)
    this.name = "NotFoundError"
    this.statusCode = 404
  }
}
