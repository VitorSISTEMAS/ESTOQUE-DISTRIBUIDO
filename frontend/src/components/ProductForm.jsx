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
      <h2>Cadastrar Produto</h2>
      <input placeholder="Nome" value={form.name} onChange={(event) => update("name", event.target.value)} required />
      <input placeholder="SKU" value={form.sku} onChange={(event) => update("sku", event.target.value)} required />
      <input placeholder="Descricao" value={form.description} onChange={(event) => update("description", event.target.value)} />
      <select value={form.stockTypeId} onChange={(event) => update("stockTypeId", event.target.value)}>
        <option value="">Tipo de Estoque</option>
        {stockTypes.map((st) => (
          <option key={st.id} value={st.id}>{st.id} - {st.name}</option>
        ))}
      </select>
      <button type="submit">Cadastrar</button>
    </form>
  )
}
