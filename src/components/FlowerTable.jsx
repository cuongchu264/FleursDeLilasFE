function FlowerTable({ flowers, onEdit, onDelete }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Flower Table</h2>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Total</th>
              <th>Available</th>
              <th>Failed</th>
              <th>Buy Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flowers.map((flower) => (
              <tr key={flower.id}>
                <td>{flower.name}</td>
                <td>{flower.price.toLocaleString()}₫</td>
                <td>{flower.totalCount}</td>
                <td>{flower.availableCount}</td>
                <td>{flower.failedCount}</td>
                <td>{flower.buyDate ? new Date(flower.buyDate).toLocaleDateString() : '—'}</td>
                <td>{flower.note || 'No note'}</td>
                <td>
                  <div className="row-actions">
                    <button className="small-button edit-button" onClick={() => onEdit(flower)}>Edit</button>
                    <button className="small-button delete-button" onClick={() => onDelete(flower.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default FlowerTable;
