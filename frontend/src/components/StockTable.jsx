export function StockTable({ stock }) {
  return (
    <section className="panel">
      <h2>Estoque por Filial</h2>
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
            {stock.map((item) => (
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
  );
}
