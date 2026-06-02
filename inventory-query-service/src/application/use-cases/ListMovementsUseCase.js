export class ListMovementsUseCase {
  constructor(readRepository) {
    this.readRepository = readRepository;
  }

  async execute() {
    return this.readRepository.listMovements();
  }
}
