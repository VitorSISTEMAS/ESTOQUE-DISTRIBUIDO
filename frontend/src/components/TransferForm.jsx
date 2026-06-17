import { useState } from "react"

export function TransferForm({ branches, products, onSubmit }) {
  const [form, setForm] = useState({
    productId: "",
    sourceBranch: branches[0],
    targetBranch: branches[1],
    quantity: 1
  })

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    await onSubmit({ ...form, quantity: Number(form.quantity) })
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <h2>Transferir Estoque</h2>
      <select value={form.productId} onChange={(event) => update("productId", event.target.value)} required>
        <option value="">Produto</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>{product.name} - {product.sku}</option>
        ))}
      </select>
      <select value={form.sourceBranch} onChange={(event) => update("sourceBranch", event.target.value)}>
        {branches.map((branch) => <option key={branch}>{branch}</option>)}
      </select>
      <select value={form.targetBranch} onChange={(event) => update("targetBranch", event.target.value)}>
        {branches.map((branch) => <option key={branch}>{branch}</option>)}
      </select>
      <input type="number" min="1" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} />
      <button type="submit">Transferir</button>
    </form>
  )
}
