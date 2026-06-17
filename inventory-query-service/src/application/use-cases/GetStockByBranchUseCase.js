import { StockReadModel } from "../../domain/entities/StockReadModel.js"
import { NotFoundError } from "../../domain/errors/NotFoundError.js"

export class GetStockByBranchUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository
  }

  async execute(branch) {
    try {
      StockReadModel.validateBranch(branch)
    } catch {
      throw new NotFoundError("Branch", branch)
    }

    const records = await this.readRepository.listStockByBranch(branch)
    return records.map(r => new StockReadModel(r))
  }
}
