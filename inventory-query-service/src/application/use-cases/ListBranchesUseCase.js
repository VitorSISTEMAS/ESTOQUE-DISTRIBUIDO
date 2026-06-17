export class ListBranchesUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository
  }

  async execute() {
    return this.readRepository.listBranches()
  }
}
