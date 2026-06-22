export function ProductTable({ products, stockTypes }) {
  function getStockTypeName(id) {
    const st = stockTypes.find((t) => t.id === id)
    return st ? st.name : "-"
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div><span className="section-kicker">Catálogo</span><h2>Produtos cadastrados</h2><p>Itens disponíveis para movimentação entre filiais.</p></div>
        <span className="record-count">{products.length} produtos</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>SKU</th>
              <th>Tipo Estoque</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td><strong className="table-primary">{product.name}</strong></td>
                <td><span className="sku">{product.sku}</span></td>
                <td><span className="status-badge status-badge--neutral">{getStockTypeName(product.stockTypeId)}</span></td>
                <td>{product.description || "-"}</td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="4"><div className="empty-state">Nenhum produto cadastrado até o momento.</div></td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  )
}
