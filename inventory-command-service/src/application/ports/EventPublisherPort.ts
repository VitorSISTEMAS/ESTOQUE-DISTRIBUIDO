export interface EventPublisherPort {
  publish(routingKey: string, event: Record<string, unknown>): Promise<void>
}
