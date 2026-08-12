function SupplyTable({ supplies, onEdit, onDelete }) {
  return (
    <section className="panel">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Price Per Supply</th>
              <th>Total</th>
              <th>Buy Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply) => (
              <tr key={supply.id}>
                <td><span className="truncated" title={supply.name}>{supply.name}</span></td>
                <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(supply.price)}</td>
                <td>{supply.count ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(supply.price / supply.count) : '—'}</td>
                <td>{supply.count}</td>
                <td>{supply.buyDate ? new Date(supply.buyDate).toLocaleDateString() : '—'}</td>
                <td><span className="truncated" title={supply.note || 'No note'}>{supply.note || 'No note'}</span></td>
                <td>
                  <div className="row-actions">
                    <button className="small-button edit-button" onClick={() => onEdit(supply)}>Edit</button>
                    <button className="small-button delete-button" onClick={() => onDelete(supply.id)}>Delete</button>
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

export default SupplyTable;
