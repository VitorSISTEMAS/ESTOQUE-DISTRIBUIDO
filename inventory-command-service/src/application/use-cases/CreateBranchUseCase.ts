import { randomUUID } from "node:crypto"
import { BranchRepositoryPort } from "../ports/BranchRepositoryPort.js"
import { EventPublisherPort } from "../ports/EventPublisherPort.js"

interface CreateBranchInput {
  name: string
  address?: string | null
}

export class CreateBranchUseCase {
  private branchRepository: BranchRepositoryPort
  private eventPublisher: EventPublisherPort

  constructor(branchRepository: BranchRepositoryPort, eventPublisher: EventPublisherPort) {
    this.branchRepository = branchRepository
    this.eventPublisher = eventPublisher
  }

  async execute(input: CreateBranchInput): Promise<any> {
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
