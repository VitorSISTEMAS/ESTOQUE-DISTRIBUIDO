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
        setError("Nenhuma transferência encontrada para os filtros aplicados.")
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
      <div className="panel-header">
        <div><span className="section-kicker">Auditoria</span><h2>Histórico de transferências</h2><p>Filtre as movimentações entre unidades por período e produto.</p></div>
      </div>
      <form className="form-grid history-filters" onSubmit={submit}>
        <label>Produto<select value={form.productId} onChange={(event) => update("productId", event.target.value)}>
          <option value="">Todos os produtos</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} - {p.sku}</option>
          ))}
        </select></label>
        <label>Tipo de estoque<select value={form.stockTypeId} onChange={(event) => update("stockTypeId", event.target.value)}>
          <option value="">Todos os tipos de estoque</option>
          {stockTypes.map((st) => (
            <option key={st.id} value={st.id}>{st.id} - {st.name}</option>
          ))}
        </select></label>
        <label>Filial<select value={form.branch} onChange={(event) => update("branch", event.target.value)}>
          <option value="">Todas as filiais</option>
          {branches.map((b) => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select></label>
        <label>Data inicial<input type="date" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} /></label>
        <label>Data final<input type="date" value={form.endDate} onChange={(event) => update("endDate", event.target.value)} /></label>
        <button type="submit" disabled={loading}>{loading ? "Consultando..." : "Consultar histórico"}</button>
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
                    <td><span className={`movement-badge ${info.cls}`}>{info.label}</span></td>
                    <td><strong className="table-primary">{m.productName}</strong></td>
                    <td><span className="sku">{m.sku}</span></td>
                    <td>{getStockTypeName(m.stockTypeId)}</td>
                    <td>{m.branch || "-"}</td>
                    <td>{m.sourceBranch || "-"}</td>
                    <td>{m.targetBranch || "-"}</td>
                    <td className="qty">{m.quantity}</td>
                    <td>{new Date(m.createdAt).toLocaleString("pt-BR")}</td>
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
