import { BranchRepositoryPort } from "../ports/BranchRepositoryPort.js"

export class ListBranchesUseCase {
  private branchRepository: BranchRepositoryPort

  constructor(branchRepository: BranchRepositoryPort) {
    this.branchRepository = branchRepository
  }

  async execute(): Promise<any> {
    return this.branchRepository.listAll()
  }
}
