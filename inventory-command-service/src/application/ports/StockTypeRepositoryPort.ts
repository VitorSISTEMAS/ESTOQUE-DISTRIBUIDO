export interface StockTypeRepositoryPort {
  findById(id: number | string): Promise<any>
  listAll(): Promise<any>
}
