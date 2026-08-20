function Dashboard({ flowers = [], supplies = [] }) {
  return (
    <>
      {flowers.length > 0 && (
        <section className="summary-section">
          <h3>Flowers</h3>
          <div className="summary-grid">
            <article className="summary-card">
              <span className="summary-label">Total Flowers</span>
              <strong>{flowers.length}</strong>
            </article>
            <article className="summary-card">
              <span className="summary-label">Available</span>
              <strong>{flowers.reduce((sum, item) => sum + item.availableCount, 0)}</strong>
            </article>
            <article className="summary-card">
              <span className="summary-label">Total Value</span>
              <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(flowers.reduce((sum, item) => sum + item.price, 0))}</strong>
            </article>
          </div>
        </section>
      )}

      {supplies.length > 0 && (
        <section className="summary-section">
          <h3>Supplies</h3>
          <div className="summary-grid">
            <article className="summary-card">
              <span className="summary-label">Total Supplies</span>
              <strong>{supplies.length}</strong>
            </article>
            <article className="summary-card">
              <span className="summary-label">Total Quantity</span>
              <strong>{supplies.reduce((sum, item) => sum + item.count, 0)}</strong>
            </article>
            <article className="summary-card">
              <span className="summary-label">Total Value</span>
              <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(supplies.reduce((sum, item) => sum + item.price, 0))}</strong>
            </article>
          </div>
        </section>
      )}
    </>
  );
}

export default Dashboard;
