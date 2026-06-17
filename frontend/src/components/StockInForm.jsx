import { useState } from "react"

export function StockInForm({ branches, products, onSubmit }) {
  const [form, setForm] = useState({ productId: "", branch: branches[0], quantity: 1 })

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    await onSubmit({ ...form, quantity: Number(form.quantity) })
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <h2>Entrada de Estoque</h2>
      <select value={form.productId} onChange={(event) => update("productId", event.target.value)} required>
        <option value="">Produto</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>{product.name} - {product.sku}</option>
        ))}
      </select>
      <select value={form.branch} onChange={(event) => update("branch", event.target.value)}>
        {branches.map((branch) => <option key={branch}>{branch}</option>)}
      </select>
      <input type="number" min="1" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} />
      <button type="submit">Adicionar</button>
    </form>
  )
}
