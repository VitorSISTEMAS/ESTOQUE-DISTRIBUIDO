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
      setError("Nome do produto e obrigatorio.")
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
          setError(`Produto nao encontrado no tipo de estoque ${st ? st.name : "selecionado"}.`)
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
      <h2>Consultar Estoque</h2>
      <form className="form-grid" onSubmit={submit}>
        <input
          placeholder="Nome do produto (obrigatorio)"
          value={form.productName}
          onChange={(event) => update("productName", event.target.value)}
          required
        />
        <select value={form.stockTypeId} onChange={(event) => update("stockTypeId", event.target.value)}>
          <option value="">Todos os tipos de estoque</option>
          {stockTypes.map((st) => (
            <option key={st.id} value={st.id}>{st.id} - {st.name}</option>
          ))}
        </select>
        <button type="submit" disabled={loading}>Consultar</button>
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
                  <td>{item.productName}</td>
                  <td>{item.sku}</td>
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
