export class ListEventsUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository
  }

  async execute() {
    return this.readRepository.listEvents()
  }
}
