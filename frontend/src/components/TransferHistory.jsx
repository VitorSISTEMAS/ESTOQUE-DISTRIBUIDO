import { useState } from "react"
import { queryApi } from "../api/queryApi.js"

export function TransferHistory({ stockTypes, products, branches }) {
  const [form, setForm] = useState({ productId: "", stockTypeId: "", branch: "", startDate: "", endDate: "" })
  const [results, setResults] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function rowInfo(type) {
    if (type === "TRANSFER_OUT") return { label: "Envio", cls: "row-envio" }
    if (type === "TRANSFER_IN") return { label: "Recebimento", cls: "row-recebimento" }
    return { label: type, cls: "" }
  }

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError("")
    setResults(null)

    try {
      const params = {}
      if (form.productId) params.productName = products.find((p) => p.id === form.productId)?.name
      if (form.stockTypeId) params.stockTypeId = form.stockTypeId
      if (form.startDate) params.startDate = form.startDate
      if (form.endDate) params.endDate = form.endDate

      const response = await queryApi.get("/movements", { params })
      const data = response.data

      let transfers = data.filter(
        (m) => m.type === "TRANSFER_OUT" || m.type === "TRANSFER_IN"
      )

      if (form.branch) {
        transfers = transfers.filter((m) => m.branch === form.branch)
      }

      if (transfers.length === 0) {
        setError("Nenhuma transferencia encontrada com esses filtros.")
      } else {
        setResults(transfers)
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
      <h2>Historico de Transferencias</h2>
      <form className="form-grid" onSubmit={submit}>
        <select value={form.productId} onChange={(event) => update("productId", event.target.value)}>
          <option value="">Todos os produtos</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} - {p.sku}</option>
          ))}
        </select>
        <select value={form.stockTypeId} onChange={(event) => update("stockTypeId", event.target.value)}>
          <option value="">Todos os tipos de estoque</option>
          {stockTypes.map((st) => (
            <option key={st.id} value={st.id}>{st.id} - {st.name}</option>
          ))}
        </select>
        <select value={form.branch} onChange={(event) => update("branch", event.target.value)}>
          <option value="">Todas as filiais</option>
          {branches.map((b) => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select>
        <input type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} />
        <input type="date" value={form.endDate} onChange={(event) => update("endDate", event.target.value)} />
        <button type="submit" disabled={loading}>Consultar</button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {results && results.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Produto</th>
                <th>SKU</th>
                <th>Tipo Estoque</th>
                <th>Filial</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Qtd.</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {results.map((m) => {
                const info = rowInfo(m.type)
                return (
                  <tr key={m.id} className={info.cls}>
                    <td>{info.label}</td>
                    <td>{m.productName}</td>
                    <td>{m.sku}</td>
                    <td>{getStockTypeName(m.stockTypeId)}</td>
                    <td>{m.branch || "-"}</td>
                    <td>{m.sourceBranch || "-"}</td>
                    <td>{m.targetBranch || "-"}</td>
                    <td className="qty">{m.quantity}</td>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
