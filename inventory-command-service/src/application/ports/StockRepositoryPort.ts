export interface StockRepositoryPort {
  addStock(params: { productId: string; branch: string; quantity: number }): Promise<any>
  registerSale(params: { productId: string; branch: string; quantity: number }): Promise<any>
  transferStock(params: { productId: string; sourceBranch: string; targetBranch: string; quantity: number }): Promise<any>
  createMovement(params: { productId: string; type: string; branch?: string | null; sourceBranch?: string | null; targetBranch?: string | null; quantity: number }): Promise<any>
}
