import { useMemo } from "react"

const ICONS = {
  products: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  branches: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5",
  warning: "M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-3L13.74 4a2 2 0 00-3.48 0L3.33 16a2 2 0 001.74 3z",
  events: "M13 10V3L4 14h7v7l9-11h-7z",
}

function stockStatus(quantity) {
  if (quantity <= 0) return { label: "Sem estoque", className: "danger" }
  if (quantity <= 5) return { label: "Baixo estoque", className: "warning" }
  return { label: "Estoque normal", className: "success" }
}

export function Dashboard({ products, stock, movements, events, branches }) {
  const totalStock = useMemo(() => stock.reduce((sum, item) => sum + item.quantity, 0), [stock])
  const lowStock = useMemo(() => stock.filter((item) => item.quantity <= 5).length, [stock])
  const recentMovements = movements.slice(-5).reverse()
  const recentEvents = events.slice(-5).reverse()
  const stockPreview = [...stock].sort((a, b) => a.quantity - b.quantity).slice(0, 6)

  const cards = [
    { key: "products", label: "Total de produtos", value: products.length, detail: `${totalStock} unidades disponíveis`, tone: "blue" },
    { key: "branches", label: "Filiais cadastradas", value: branches.length, detail: "Unidades participantes", tone: "indigo" },
    { key: "warning", label: "Itens em atenção", value: lowStock, detail: "Com até 5 unidades", tone: "amber" },
    { key: "events", label: "Eventos processados", value: events.length, detail: `${movements.length} movimentações`, tone: "green" },
  ]

  return (
    <div className="dashboard">
      <div className="stats-row">
        {cards.map((card) => (
          <article key={card.key} className={`stat-card stat-card--${card.tone}`}>
            <div className="stat-card__head">
              <div className="stat-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d={ICONS[card.key]} />
                </svg>
              </div>
              <span className="stat-trend">Atual</span>
            </div>
            <strong className="stat-card__value">{card.value}</strong>
            <span className="stat-card__label">{card.label}</span>
            <span className="stat-card__detail">{card.detail}</span>
          </article>
        ))}
      </div>

      <div className="dashboard-primary">
        <section className="panel panel--wide">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Disponibilidade</span>
              <h2>Visão geral do estoque</h2>
              <p>Produtos que exigem atenção aparecem primeiro.</p>
            </div>
            <span className="record-count">{stock.length} registros</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Produto</th><th>SKU</th><th>Filial</th><th>Quantidade</th><th>Status</th></tr>
              </thead>
              <tbody>
                {stockPreview.map((item) => {
                  const status = stockStatus(item.quantity)
                  return (
                    <tr key={item.id}>
                      <td><strong className="table-primary">{item.productName}</strong></td>
                      <td><span className="sku">{item.sku}</span></td>
                      <td>{item.branch}</td>
                      <td className="qty">{item.quantity}</td>
                      <td><span className={`status-badge status-badge--${status.className}`}>{status.label}</span></td>
                    </tr>
                  )
                })}
                {stockPreview.length === 0 && (
                  <tr><td colSpan="5"><div className="empty-state">Nenhum estoque registrado até o momento.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Atividade</span>
              <h2>Movimentações recentes</h2>
              <p>Últimas alterações no estoque.</p>
            </div>
          </div>
          <div className="activity-list">
            {recentMovements.map((movement) => (
              <div className="activity-item" key={movement.id}>
                <span className={`activity-icon activity-icon--${movement.type === "TRANSFER_IN" ? "in" : movement.type === "TRANSFER_OUT" ? "out" : "neutral"}`}>
                  {movement.type === "TRANSFER_IN" ? "↓" : movement.type === "TRANSFER_OUT" ? "↑" : "•"}
                </span>
                <div>
                  <strong>{movement.productName}</strong>
                  <span>{movement.branch || movement.sourceBranch || "Filial não informada"}</span>
                </div>
                <b>{movement.quantity}</b>
              </div>
            ))}
            {recentMovements.length === 0 && <div className="empty-state">Nenhuma movimentação registrada.</div>}
          </div>
        </section>
      </div>

      <div className="dashboard-secondary">
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Integração</span>
              <h2>Fluxo de processamento</h2>
              <p>Visão simplificada da consistência eventual.</p>
            </div>
          </div>
          <div className="service-flow">
            {["Command Service", "RabbitMQ", "Sync Service", "Query Service"].map((service, index) => (
              <div className="flow-step" key={service}>
                <span>{index + 1}</span>
                <strong>{service}</strong>
                {index < 3 && <b>→</b>}
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Eventos</span>
              <h2>Últimos eventos processados</h2>
              <p>Mensagens recebidas pelo modelo de leitura.</p>
            </div>
          </div>
          <div className="event-list">
            {recentEvents.map((event) => (
              <div className="event-row" key={event.id}>
                <span className="event-badge">{event.eventType}</span>
                <code>{event.eventId?.slice(0, 8) || "—"}</code>
                <span className="status-badge status-badge--success">Processado</span>
              </div>
            ))}
            {recentEvents.length === 0 && <div className="empty-state">Nenhum evento processado até o momento.</div>}
          </div>
        </section>
      </div>
    </div>
  )
}
