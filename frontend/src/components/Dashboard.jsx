import { useMemo } from "react"

const ICONS = {
  products: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  stock: "M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z",
  branches: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  events: "M13 10V3L4 14h7v7l9-11h-7z",
}

export function Dashboard({ products, stock, movements, events, branches }) {
  const totalStock = useMemo(
    () => stock.reduce((sum, item) => sum + item.quantity, 0),
    [stock]
  )

  const stockByBranch = useMemo(() => {
    const map = {}
    for (const item of stock) {
      map[item.branch] = (map[item.branch] || 0) + item.quantity
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [stock])

  const maxStock = stockByBranch.length > 0 ? stockByBranch[0][1] : 1

  const recentMovements = movements.slice(-8).reverse()

  const recentEvents = events.slice(-6).reverse()

  const stockByProduct = useMemo(() => {
    const map = {}
    for (const item of stock) {
      map[item.productName] = (map[item.productName] || 0) + item.quantity
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [stock])

  const maxProduct = stockByProduct.length > 0 ? stockByProduct[0][1] : 1

  const cards = [
    { key: "products", label: "Produtos", value: products.length, color: "#059669" },
    { key: "stock", label: "Itens em Estoque", value: totalStock, color: "#0284c7" },
    { key: "branches", label: "Filiais", value: branches.length, color: "#d97706" },
    { key: "events", label: "Eventos", value: events.length, color: "#7c3aed" },
  ]

  return (
    <div className="dashboard">
      <div className="stats-row">
        {cards.map((card) => (
          <div key={card.key} className="stat-card" style={{ borderTopColor: card.color }}>
            <div className="stat-card__icon" style={{ color: card.color }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={ICONS[card.key]} />
              </svg>
            </div>
            <div className="stat-card__info">
              <span className="stat-card__value">{card.value}</span>
              <span className="stat-card__label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h2>Estoque por Filial</h2>
          <div className="stock-bars">
            {stockByBranch.length === 0 ? (
              <p className="empty-msg">Nenhum estoque registrado</p>
            ) : (
              stockByBranch.map(([branch, qty]) => (
                <div key={branch} className="bar-row">
                  <span className="bar-label">{branch}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(qty / maxStock) * 100}%` }} />
                  </div>
                  <span className="bar-value">{qty}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panel">
          <h2>Movimentações Recentes</h2>
          {recentMovements.length === 0 ? (
            <p className="empty-msg">Nenhuma movimentação</p>
          ) : (
            <div className="movement-list">
              {recentMovements.map((m) => (
                <div key={m.id} className="movement-item">
                  <div className={`movement-type movement-type--${m.type === "TRANSFER_IN" ? "in" : m.type === "TRANSFER_OUT" ? "out" : "other"}`}>
                    {m.type === "TRANSFER_IN" ? "↓" : m.type === "TRANSFER_OUT" ? "↑" : "•"}
                  </div>
                  <div className="movement-info">
                    <strong>{m.productName}</strong>
                    <span>{m.branch || m.sourceBranch}{m.targetBranch ? ` → ${m.targetBranch}` : ""}</span>
                  </div>
                  <span className="movement-qty">{m.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h2>Eventos Recentes</h2>
          {recentEvents.length === 0 ? (
            <p className="empty-msg">Nenhum evento</p>
          ) : (
            <div className="event-list">
              {recentEvents.map((e) => (
                <div key={e.id} className="event-chip">
                  <span className="event-chip__type">{e.eventType}</span>
                  <span className="event-chip__id">{e.eventId?.slice(0, 8)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h2>Distribuição por Produto</h2>
          {stockByProduct.length === 0 ? (
            <p className="empty-msg">Nenhum estoque registrado</p>
          ) : (
            <div className="stock-bars">
              {stockByProduct.map(([name, qty]) => (
                <div key={name} className="bar-row">
                  <span className="bar-label">{name}</span>
                  <div className="bar-track">
                    <div className="bar-fill bar-fill--alt" style={{ width: `${(qty / maxProduct) * 100}%` }} />
                  </div>
                  <span className="bar-value">{qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
