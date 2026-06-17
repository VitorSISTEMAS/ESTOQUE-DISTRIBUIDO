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

  return (
    <section className="panel">
      <h2>Estoque por Filial</h2>
      <select value={selected} onChange={(e) => setSelected(e.target.value)} className="branch-filter">
        {branches.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Filial</th>
              <th>Produto</th>
              <th>SKU</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.branch}</td>
                <td>{item.productName}</td>
                <td>{item.sku}</td>
                <td className="qty">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
