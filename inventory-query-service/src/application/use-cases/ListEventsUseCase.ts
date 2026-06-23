import { ReadRepositoryPort } from "../ports/ReadRepositoryPort.js"

export class ListEventsUseCase {
  private readRepository: ReadRepositoryPort

  constructor(readRepository: ReadRepositoryPort) {
    this.readRepository = readRepository
  }

  async execute(): Promise<any[]> {
    return this.readRepository.listEvents()
  }
}
