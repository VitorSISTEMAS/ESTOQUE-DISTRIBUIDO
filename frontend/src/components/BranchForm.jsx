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
      <div className="panel-header">
        <div><span className="section-kicker">Nova unidade</span><h2>Cadastrar filial</h2><p>Adicione uma unidade à rede de estoque.</p></div>
      </div>
      <label>Nome da filial<input placeholder="Ex.: Centro - Porto Alegre" value={form.name} onChange={(event) => update("name", event.target.value)} required /></label>
      <label>Endereço<input placeholder="Rua, número e cidade" value={form.address} onChange={(event) => update("address", event.target.value)} /></label>
      <button type="submit">Cadastrar filial</button>
    </form>
  )
}
