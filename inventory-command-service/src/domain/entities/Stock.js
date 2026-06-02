export const BRANCHES = ["Taquara", "Porto Alegre", "Novo Hamburgo"];

export class Stock {
  static validateBranch(branch) {
    if (!BRANCHES.includes(branch)) {
      throw new Error(`Filial invalida. Use: ${BRANCHES.join(", ")}.`);
    }
  }

  static validateQuantity(quantity) {
    const normalized = Number(quantity);
    if (!Number.isInteger(normalized) || normalized <= 0) {
      throw new Error("Quantidade deve ser um inteiro maior que zero.");
    }
    return normalized;
  }
}
