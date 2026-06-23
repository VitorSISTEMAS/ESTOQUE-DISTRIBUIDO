import { ReadModelRepositoryPort } from "../ports/ReadModelRepositoryPort.js"

export class BranchCreatedHandler {
  private readModelRepository: ReadModelRepositoryPort

  constructor(readModelRepository: ReadModelRepositoryPort) {
    this.readModelRepository = readModelRepository
  }

  async handle(event: Record<string, unknown>): Promise<void> {
    await this.readModelRepository.applyBranchCreated(event)
  }
}
