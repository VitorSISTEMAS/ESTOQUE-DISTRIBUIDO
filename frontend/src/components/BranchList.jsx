export function BranchList({ branches }) {
  return (
    <section className="panel">
      <h2>Filiais Cadastradas</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Endereco</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id}>
                <td>{branch.name}</td>
                <td>{branch.address || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
