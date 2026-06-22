import { useMemo, useState } from "react"

export function MovementTable({ movements }) {
  const branches = useMemo(() => {
    const set = new Set()
    for (const m of movements) {
      if (m.branch) set.add(m.branch)
      if (m.sourceBranch) set.add(m.sourceBranch)
      if (m.targetBranch) set.add(m.targetBranch)
    }
    return ["Todas", ...[...set].sort()]
  }, [movements])

  const [selected, setSelected] = useState("Todas")

  const filtered = useMemo(() => {
    if (selected === "Todas") return movements
    return movements.filter((m) => m.branch === selected || m.sourceBranch === selected || m.targetBranch === selected)
  }, [movements, selected])

  function rowInfo(type) {
    if (type === "TRANSFER_OUT") return { label: "Envio", cls: "row-envio" }
    if (type === "TRANSFER_IN") return { label: "Recebimento", cls: "row-recebimento" }
    return { label: type, cls: "" }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div><span className="section-kicker">Rastreabilidade</span><h2>Movimentações</h2><p>Entradas, saídas e transferências registradas.</p></div>
        <label className="filter-control">Filial<select value={selected} onChange={(e) => setSelected(e.target.value)} className="branch-filter">
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select></label>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Produto</th>
              <th>SKU</th>
              <th>Filial</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Qtd.</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((movement) => {
              const info = rowInfo(movement.type)
              return (
                <tr key={movement.id} className={info.cls}>
                  <td><span className={`movement-badge ${info.cls}`}>{info.label}</span></td>
                  <td><strong className="table-primary">{movement.productName}</strong></td>
                  <td><span className="sku">{movement.sku}</span></td>
                  <td>{movement.branch || "-"}</td>
                  <td>{movement.sourceBranch || "-"}</td>
                  <td>{movement.targetBranch || "-"}</td>
                  <td className="qty">{movement.quantity}</td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan="7"><div className="empty-state">Nenhuma movimentação encontrada para este filtro.</div></td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
