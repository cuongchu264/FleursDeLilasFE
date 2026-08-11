function Dashboard({ flowers }) {
  return (
    <section className="summary-grid">
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
        <strong>{flowers.reduce((sum, item) => sum + item.price, 0).toLocaleString()}₫</strong>
      </article>
    </section>
  );
}

export default Dashboard;
