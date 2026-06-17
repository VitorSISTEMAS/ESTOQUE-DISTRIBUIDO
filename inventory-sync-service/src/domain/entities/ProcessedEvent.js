export class ProcessedEvent {
  constructor({ id, eventId, eventType, payload, processedAt = new Date() }) {
    if (!eventId) throw new Error("Event ID is required")
    if (!eventType) throw new Error("Event type is required")

    this.id = id
    this.eventId = eventId
    this.eventType = eventType
    this.payload = payload
    this.processedAt = new Date(processedAt)
  }
}
