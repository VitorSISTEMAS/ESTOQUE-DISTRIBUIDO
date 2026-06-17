export class BranchCreatedHandler {
  constructor(readModelRepository) {
    this.readModelRepository = readModelRepository
  }

  async handle(event) {
    await this.readModelRepository.applyBranchCreated(event)
  }
}
