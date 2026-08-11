function SupplyTable({ supplies }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Supply List</h2>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Count</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply) => (
              <tr key={supply.id}>
                <td>{supply.name}</td>
                <td>{supply.price.toLocaleString()}₫</td>
                <td>{supply.count}</td>
                <td>{supply.note || 'No note'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default SupplyTable;
