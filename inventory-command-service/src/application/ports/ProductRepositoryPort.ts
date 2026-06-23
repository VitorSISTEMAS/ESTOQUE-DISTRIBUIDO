import { Product } from "../../domain/entities/Product.js"

export interface ProductRepositoryPort {
  create(product: Product): Promise<any>
  findById(id: string): Promise<any>
}
