import { ReadRepositoryPort } from "../ports/ReadRepositoryPort.js"
import { StockReadModel } from "../../domain/entities/StockReadModel.js"
import { NotFoundError } from "../../domain/errors/NotFoundError.js"

export class GetStockByBranchUseCase {
  private readRepository: ReadRepositoryPort

  constructor(readRepository: ReadRepositoryPort) {
    this.readRepository = readRepository
  }

  async execute(branch: string): Promise<StockReadModel[]> {
    const branches = await this.readRepository.listBranches()
    const exists = branches.some(b => b.name === branch)
    if (!exists) {
      throw new NotFoundError("Branch", branch)
    }

    const records = await this.readRepository.listStockByBranch(branch)
    return records.map(r => new StockReadModel(r))
  }
}
