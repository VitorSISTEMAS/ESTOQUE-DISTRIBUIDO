export class Stock {
  static validateQuantity(quantity: unknown): number {
    const normalized = Number(quantity)
    if (!Number.isInteger(normalized) || normalized <= 0) {
      throw new Error("Quantity must be a positive integer.")
    }
    return normalized
  }
}
