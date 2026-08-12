function FlowerCardList({ flowers, onEdit, onDelete }) {
  return (
    <section className="card-list-wrapper">
      <div className="card-list-grid">
        {flowers.map((flower) => (
          <article className="resource-card" key={flower.id}>
            <div className="card-header">
              <span className="resource-title">{flower.name}</span>
              <span className="resource-price">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(flower.price)}</span>
            </div>

            <div className="resource-badges">
              <span>Total: {flower.totalCount}</span>
              <span>Available: {flower.availableCount}</span>
              <span>Failed: {flower.failedCount}</span>
            </div>

            <p className="resource-note">{flower.note || 'No note'}</p>

            <div className="row-actions card-actions">
              <button className="small-button edit-button" onClick={() => onEdit(flower)}>Edit</button>
              <button className="small-button delete-button" onClick={() => onDelete(flower.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FlowerCardList;
