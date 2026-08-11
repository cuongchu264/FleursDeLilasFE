function SupplyCardList({ supplies, onEdit, onDelete }) {
  return (
    <section className="card-list-wrapper">
      <div className="card-list-grid">
        {supplies.map((supply) => (
          <article className="resource-card" key={supply.id}>
            <div className="card-header">
              <span className="resource-title">{supply.name}</span>
              <span className="resource-price">{supply.price.toLocaleString()}₫</span>
            </div>

            <div className="resource-badges">
              <span>Count: {supply.count}</span>
            </div>

            <p className="resource-note">{supply.note || 'No note'}</p>

            <div className="row-actions card-actions">
              <button className="small-button edit-button" onClick={() => onEdit(supply)}>Edit</button>
              <button className="small-button delete-button" onClick={() => onDelete(supply.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SupplyCardList;
