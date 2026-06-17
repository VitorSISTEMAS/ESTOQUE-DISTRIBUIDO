import { useState } from "react"

export function BranchForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", address: "" })

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    await onSubmit(form)
    setForm({ name: "", address: "" })
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <h2>Cadastrar Filial</h2>
      <input placeholder="Nome da filial" value={form.name} onChange={(event) => update("name", event.target.value)} required />
      <input placeholder="Endereco" value={form.address} onChange={(event) => update("address", event.target.value)} />
      <button type="submit">Cadastrar</button>
    </form>
  )
}
