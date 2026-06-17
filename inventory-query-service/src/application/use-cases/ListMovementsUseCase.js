import { MovementReadModel } from "../../domain/entities/MovementReadModel.js"

export class ListMovementsUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository
  }

  async execute(filters = {}) {
    const records = await this.readRepository.listMovements(filters)
    return records.map(r => new MovementReadModel(r))
  }
}
