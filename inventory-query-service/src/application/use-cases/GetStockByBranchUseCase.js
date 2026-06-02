export class GetStockByBranchUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository;
  }

  async execute(branch) {
    return this.readRepository.listStockByBranch(branch);
  }
}
