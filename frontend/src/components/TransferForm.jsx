import { useState } from "react"
import { ProductSelect } from "./ProductSelect.jsx"

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
    await onSubmit({
      ...form,
      sourceBranch: form.sourceBranch || branches[0],
      targetBranch: form.targetBranch || branches[1] || branches[0],
      quantity: Number(form.quantity)
    })
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="panel-header"><div><span className="section-kicker">Movimentação</span><h2>Transferir estoque</h2><p>Defina a origem, o destino e a quantidade.</p></div></div>
      <label>Produto<ProductSelect products={products} value={form.productId} onChange={(v) => update("productId", v)} required /></label>
      <label>Filial de origem<select value={form.sourceBranch || branches[0] || ""} onChange={(event) => update("sourceBranch", event.target.value)} required>
        {branches.length === 0 && <option value="">Aguardando filiais</option>}
        {branches.map((branch) => <option key={branch}>{branch}</option>)}
      </select></label>
      <label>Filial de destino<select value={form.targetBranch || branches[1] || branches[0] || ""} onChange={(event) => update("targetBranch", event.target.value)} required>
        {branches.length === 0 && <option value="">Aguardando filiais</option>}
        {branches.map((branch) => <option key={branch}>{branch}</option>)}
      </select></label>
      <label>Quantidade<input type="number" min="1" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} /></label>
      <div className="transfer-preview">
        <span>Resumo da operação</span>
        <strong>{form.quantity} unidade(s) de {form.sourceBranch || branches[0] || "origem"} para {form.targetBranch || branches[1] || "destino"}</strong>
      </div>
      <button type="submit">Transferir estoque</button>
    </form>
  )
}
