export interface BranchRepositoryPort {
  findByName(name: string): Promise<any>
  create(data: { name: string; address?: string | null }): Promise<any>
  listAll(): Promise<any>
}
