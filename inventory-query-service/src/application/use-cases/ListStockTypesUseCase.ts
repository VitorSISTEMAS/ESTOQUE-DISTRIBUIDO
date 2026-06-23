import { ReadRepositoryPort } from "../ports/ReadRepositoryPort.js"

export class ListStockTypesUseCase {
  private readRepository: ReadRepositoryPort

  constructor(readRepository: ReadRepositoryPort) {
    this.readRepository = readRepository
  }

  async execute(): Promise<any[]> {
    return this.readRepository.listStockTypes()
  }
}
