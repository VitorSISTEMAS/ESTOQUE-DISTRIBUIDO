export function BranchList({ branches, stock = [] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div><span className="section-kicker">Rede distribuída</span><h2>Filiais cadastradas</h2><p>Unidades participantes da operação de estoque.</p></div>
        <span className="record-count">{branches.length} unidades</span>
      </div>
      <div className="branch-grid">
        {branches.map((branch) => {
          const branchStock = stock.filter((item) => item.branch === branch.name)
          const total = branchStock.reduce((sum, item) => sum + item.quantity, 0)
          return (
            <article className="branch-card" key={branch.id}>
              <div className="branch-card__top"><span className="branch-icon">⌂</span><span className="status-badge status-badge--success">Operacional</span></div>
              <h3>{branch.name}</h3>
              <p>{branch.address || "Endereço não informado"}</p>
              <div className="branch-metrics">
                <div><strong>{branchStock.length}</strong><span>Produtos</span></div>
                <div><strong>{total}</strong><span>Itens</span></div>
              </div>
            </article>
          )
        })}
        {branches.length === 0 && <div className="empty-state">Nenhuma filial cadastrada até o momento.</div>}
      </div>
    </section>
  )
}
