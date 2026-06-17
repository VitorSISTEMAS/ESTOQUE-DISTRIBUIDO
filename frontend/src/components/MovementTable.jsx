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

  const [selected, setSelected] = useState("Taquara")

  const filtered = useMemo(() => {
    if (selected === "Todas") return movements
    return movements.filter((m) => m.branch === selected)
  }, [movements, selected])

  function rowInfo(type) {
    if (type === "TRANSFER_OUT") return { label: "Envio", cls: "row-envio" }
    if (type === "TRANSFER_IN") return { label: "Recebimento", cls: "row-recebimento" }
    return { label: type, cls: "" }
  }

  return (
    <section className="panel">
      <h2>Movimentacoes</h2>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="branch-filter">
        {branches.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
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
                  <td>{info.label}</td>
                  <td>{movement.productName}</td>
                  <td>{movement.sku}</td>
                  <td>{movement.branch || "-"}</td>
                  <td>{movement.sourceBranch || "-"}</td>
                  <td>{movement.targetBranch || "-"}</td>
                  <td className="qty">{movement.quantity}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
