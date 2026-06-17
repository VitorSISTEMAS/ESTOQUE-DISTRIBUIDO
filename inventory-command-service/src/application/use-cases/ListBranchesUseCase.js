export class ListBranchesUseCase {
  constructor(branchRepository) {
    this.branchRepository = branchRepository
  }

  async execute() {
    return this.branchRepository.listAll()
  }
}
