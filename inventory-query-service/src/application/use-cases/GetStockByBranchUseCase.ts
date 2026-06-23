import { ReadRepositoryPort } from "../ports/ReadRepositoryPort.js"
import { StockReadModel } from "../../domain/entities/StockReadModel.js"
import { NotFoundError } from "../../domain/errors/NotFoundError.js"

export class GetStockByBranchUseCase {
  private readRepository: ReadRepositoryPort

  constructor(readRepository: ReadRepositoryPort) {
    this.readRepository = readRepository
  }

  async execute(branch: string): Promise<StockReadModel[]> {
    try {
      StockReadModel.validateBranch(branch)
    } catch {
      throw new NotFoundError("Branch", branch)
    }

    const records = await this.readRepository.listStockByBranch(branch)
    return records.map(r => new StockReadModel(r))
  }
}
