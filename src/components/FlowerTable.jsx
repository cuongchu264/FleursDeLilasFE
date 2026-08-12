function FlowerTable({ flowers, onEdit, onDelete }) {
  return (
    <section className="panel">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Price Per Stem</th>
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
                <td><span className="truncated" title={flower.name}>{flower.name}</span></td>
                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(flower.price)}</td>
                <td>{flower.totalCount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(flower.price / flower.totalCount) : '—'}</td>
                <td>{flower.totalCount}</td>
                <td>{flower.availableCount}</td>
                <td>{flower.failedCount}</td>
                <td>{flower.buyDate ? new Date(flower.buyDate).toLocaleDateString() : '—'}</td>
                <td><span className="truncated" title={flower.note || 'No note'}>{flower.note || 'No note'}</span></td>
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
