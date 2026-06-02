export function MovementTable({ movements }) {
  return (
    <section className="panel">
      <h2>Movimentacoes</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Produto</th>
              <th>Filial</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Qtd.</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id}>
                <td>{movement.type}</td>
                <td>{movement.productName}</td>
                <td>{movement.branch || "-"}</td>
                <td>{movement.sourceBranch || "-"}</td>
                <td>{movement.targetBranch || "-"}</td>
                <td className="qty">{movement.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
