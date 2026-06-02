import { useState } from "react";

export function ProductForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", sku: "", description: "" });

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    await onSubmit(form);
    setForm({ name: "", sku: "", description: "" });
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <h2>Cadastrar Produto</h2>
      <input placeholder="Nome" value={form.name} onChange={(event) => update("name", event.target.value)} />
      <input placeholder="SKU" value={form.sku} onChange={(event) => update("sku", event.target.value)} />
      <input placeholder="Descricao" value={form.description} onChange={(event) => update("description", event.target.value)} />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
