import { useMemo, useState } from "react"

export function StockTable({ stock }) {
  const branches = useMemo(() => {
    const set = new Set(stock.map((s) => s.branch))
    return ["Todas", ...[...set].sort()]
  }, [stock])

  const [selected, setSelected] = useState("Todas")

  const filtered = useMemo(() => {
    if (selected === "Todas") return stock
    return stock.filter((s) => s.branch === selected)
  }, [stock, selected])

  function statusFor(quantity) {
    if (quantity <= 0) return { label: "Sem estoque", tone: "danger" }
    if (quantity <= 5) return { label: "Baixo estoque", tone: "warning" }
    return { label: "Normal", tone: "success" }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div><span className="section-kicker">Saldos atuais</span><h2>Estoque por filial</h2><p>Acompanhe a disponibilidade por produto e unidade.</p></div>
        <label className="filter-control">Filial<select value={selected} onChange={(e) => setSelected(e.target.value)} className="branch-filter">
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select></label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Filial</th>
              <th>Produto</th>
              <th>SKU</th>
              <th>Quantidade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const status = statusFor(item.quantity)
              return (
                <tr key={item.id}>
                  <td>{item.branch}</td>
                  <td><strong className="table-primary">{item.productName}</strong></td>
                  <td><span className="sku">{item.sku}</span></td>
                  <td className="qty">{item.quantity}</td>
                  <td><span className={`status-badge status-badge--${status.tone}`}>{status.label}</span></td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan="5"><div className="empty-state">Nenhum estoque encontrado para esta filial.</div></td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
