import { ReadRepositoryPort } from "../ports/ReadRepositoryPort.js"

export class ListBranchesUseCase {
  private readRepository: ReadRepositoryPort

  constructor(readRepository: ReadRepositoryPort) {
    this.readRepository = readRepository
  }

  async execute(): Promise<any[]> {
    return this.readRepository.listBranches()
  }
}
