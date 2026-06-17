import { randomUUID } from "node:crypto"

export class CreateBranchUseCase {
  constructor(branchRepository, eventPublisher) {
    this.branchRepository = branchRepository
    this.eventPublisher = eventPublisher
  }

  async execute(input) {
    if (!input.name?.trim()) throw new Error("Nome da filial e obrigatorio.")

    const existing = await this.branchRepository.findByName(input.name.trim())
    if (existing) throw new Error(`Filial "${input.name}" ja existe.`)

    const created = await this.branchRepository.create({
      name: input.name.trim(),
      address: input.address?.trim() || null
    })

    await this.eventPublisher.publish("branch.created", {
      eventId: randomUUID(),
      eventType: "BRANCH_CREATED",
      occurredAt: new Date().toISOString(),
      payload: {
        id: created.id,
        name: created.name,
        address: created.address
      }
    })

    return created
  }
}
