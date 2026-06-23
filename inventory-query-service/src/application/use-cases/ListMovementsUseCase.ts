import { ReadRepositoryPort } from "../ports/ReadRepositoryPort.js"
import { MovementReadModel } from "../../domain/entities/MovementReadModel.js"

interface MovementFilters {
  productName?: string
  stockTypeId?: number
  startDate?: string
  endDate?: string
}

export class ListMovementsUseCase {
  private readRepository: ReadRepositoryPort

  constructor(readRepository: ReadRepositoryPort) {
    this.readRepository = readRepository
  }

  async execute(filters: MovementFilters = {}): Promise<MovementReadModel[]> {
    const records = await this.readRepository.listMovements(filters)
    return records.map(r => new MovementReadModel(r))
  }
}
