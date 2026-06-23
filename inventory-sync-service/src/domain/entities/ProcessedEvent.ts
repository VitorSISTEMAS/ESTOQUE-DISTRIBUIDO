interface ProcessedEventInput {
  id?: string
  eventId: string
  eventType: string
  payload?: Record<string, unknown> | null
  processedAt?: Date
}

export class ProcessedEvent {
  id?: string
  eventId: string
  eventType: string
  payload: Record<string, unknown> | null | undefined
  processedAt: Date

  constructor({ id, eventId, eventType, payload, processedAt = new Date() }: ProcessedEventInput) {
    if (!eventId) throw new Error("Event ID is required")
    if (!eventType) throw new Error("Event type is required")

    this.id = id
    this.eventId = eventId
    this.eventType = eventType
    this.payload = payload
    this.processedAt = new Date(processedAt)
  }
}
