export interface ReadRepositoryPort {
  listProducts(): Promise<any[]>
  listStock(filters?: Record<string, any>): Promise<any[]>
  listStockByBranch(branch: string): Promise<any[]>
  listMovements(filters?: Record<string, any>): Promise<any[]>
  listEvents(): Promise<any[]>
  listBranches(): Promise<any[]>
  listStockTypes(): Promise<any[]>
}
