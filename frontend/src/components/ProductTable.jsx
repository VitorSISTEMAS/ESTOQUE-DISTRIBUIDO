export function ProductTable({ products, stockTypes }) {
  function getStockTypeName(id) {
    const st = stockTypes.find((t) => t.id === id)
    return st ? st.name : "-"
  }

  return (
    <section className="panel">
      <h2>Produtos</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>SKU</th>
              <th>Tipo Estoque</th>
              <th>Descricao</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{getStockTypeName(product.stockTypeId)}</td>
                <td>{product.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
