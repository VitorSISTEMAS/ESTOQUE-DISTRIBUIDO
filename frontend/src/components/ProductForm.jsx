import { useState } from "react"

export function ProductForm({ stockTypes, onSubmit }) {
  const [form, setForm] = useState({ name: "", sku: "", description: "", stockTypeId: "" })

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    const data = { ...form }
    if (!data.stockTypeId) data.stockTypeId = null
    await onSubmit(data)
    setForm({ name: "", sku: "", description: "", stockTypeId: "" })
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="panel-header">
        <div><span className="section-kicker">Novo item</span><h2>Cadastrar produto</h2><p>Inclua um produto no catálogo da operação.</p></div>
      </div>
      <label>Nome do produto<input placeholder="Ex.: Monitor 24 polegadas" value={form.name} onChange={(event) => update("name", event.target.value)} required /></label>
      <label>SKU<input placeholder="Ex.: MON-24-FHD" value={form.sku} onChange={(event) => update("sku", event.target.value)} required /></label>
      <label>Descrição<input placeholder="Informações complementares" value={form.description} onChange={(event) => update("description", event.target.value)} /></label>
      <label>Tipo de estoque<select value={form.stockTypeId} onChange={(event) => update("stockTypeId", event.target.value)}>
        <option value="">Selecione um tipo</option>
        {stockTypes.map((st) => (
          <option key={st.id} value={st.id}>{st.id} - {st.name}</option>
        ))}
      </select></label>
      <button type="submit">Cadastrar produto</button>
    </form>
  )
}
