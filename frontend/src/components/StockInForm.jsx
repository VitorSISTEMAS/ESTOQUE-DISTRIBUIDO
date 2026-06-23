import { useState } from "react"
import { ProductSelect } from "./ProductSelect.jsx"

export function StockInForm({ branches, products, onSubmit }) {
  const [form, setForm] = useState({ productId: "", branch: branches[0], quantity: 1 })

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    await onSubmit({ ...form, branch: form.branch || branches[0], quantity: Number(form.quantity) })
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="panel-header"><div><span className="section-kicker">Abastecimento</span><h2>Entrada de estoque</h2><p>Adicione unidades em uma filial.</p></div></div>
      <label>Produto<ProductSelect products={products} value={form.productId} onChange={(v) => update("productId", v)} required /></label>
      <label>Filial<select value={form.branch || branches[0] || ""} onChange={(event) => update("branch", event.target.value)} required>
        {branches.length === 0 && <option value="">Aguardando filiais</option>}
        {branches.map((branch) => <option key={branch}>{branch}</option>)}
      </select></label>
      <label>Quantidade<input type="number" min="1" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} /></label>
      <button type="submit">Adicionar ao estoque</button>
    </form>
  )
}
