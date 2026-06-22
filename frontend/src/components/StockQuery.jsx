import { useState } from "react"
import { queryApi } from "../api/queryApi.js"

export function StockQuery({ stockTypes }) {
  const [form, setForm] = useState({ productName: "", stockTypeId: "" })
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    if (!form.productName.trim()) {
      setError("O nome do produto é obrigatório.")
      return
    }

    setLoading(true)
    setError("")
    setResults(null)

    try {
      const params = { productName: form.productName.trim() }
      if (form.stockTypeId) params.stockTypeId = form.stockTypeId

      const response = await queryApi.get("/stock", { params })
      const data = response.data

      if (data.length === 0) {
        if (form.stockTypeId) {
          const st = stockTypes.find((t) => t.id === Number(form.stockTypeId))
          setError(`Produto não encontrado no tipo de estoque ${st ? st.name : "selecionado"}.`)
        } else {
          setError("Nenhum produto encontrado com esse nome.")
        }
      } else {
        setResults(data)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  function getStockTypeName(id) {
    const st = stockTypes.find((t) => t.id === id)
    return st ? st.name : "-"
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div><span className="section-kicker">Pesquisa operacional</span><h2>Consultar estoque</h2><p>Localize produtos e confira a disponibilidade nas filiais.</p></div>
      </div>
      <form className="form-grid form-grid--inline" onSubmit={submit}>
        <label>Nome do produto<input
          placeholder="Digite o nome do produto"
          value={form.productName}
          onChange={(event) => update("productName", event.target.value)}
          required
        /></label>
        <label>Tipo de estoque<select value={form.stockTypeId} onChange={(event) => update("stockTypeId", event.target.value)}>
          <option value="">Todos os tipos de estoque</option>
          {stockTypes.map((st) => (
            <option key={st.id} value={st.id}>{st.id} - {st.name}</option>
          ))}
        </select></label>
        <button type="submit" disabled={loading}>{loading ? "Consultando..." : "Consultar estoque"}</button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {results && results.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Filial</th>
                <th>Produto</th>
                <th>SKU</th>
                <th>Tipo Estoque</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.id}>
                  <td>{item.branch}</td>
                  <td><strong className="table-primary">{item.productName}</strong></td>
                  <td><span className="sku">{item.sku}</span></td>
                  <td>{item.stockTypeName || getStockTypeName(item.stockTypeId)}</td>
                  <td className="qty">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
