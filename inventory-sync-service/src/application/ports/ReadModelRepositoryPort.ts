export interface ReadModelRepositoryPort {
  hasProcessed(eventId: string): Promise<unknown>
  applyProductCreated(event: Record<string, unknown>): Promise<void>
  applyStockAdded(event: Record<string, unknown>): Promise<void>
  applySaleCompleted(event: Record<string, unknown>): Promise<void>
  applyStockTransferred(event: Record<string, unknown>): Promise<void>
}
