function FlowerForm({ flower, onSubmit, onCancel, isEditing }) {
  const defaultFlower = {
    name: '',
    price: 0,
    totalCount: 0,
    availableCount: 0,
    failedCount: 0,
    buyDate: '',
    note: ''
  };

  const formData = flower || defaultFlower;

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      name: event.target.name.value,
      price: Number(event.target.price.value),
      totalCount: Number(event.target.totalCount.value),
      availableCount: Number(event.target.availableCount.value),
      failedCount: Number(event.target.failedCount.value),
      buyDate: event.target.buyDate.value || null,
      note: event.target.note.value
    };

    onSubmit(payload);
  }

  return (
    <section className="panel form-panel">
      <div className="panel-header compact">
        <h2>{isEditing ? 'Edit Flower' : 'Create Flower'}</h2>
      </div>

      <form className="flower-form" onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input name="name" defaultValue={formData.name} required />
        </label>

        <label>
          <span>Price</span>
          <input name="price" type="number" defaultValue={formData.price} required />
        </label>

        <label>
          <span>Total Count</span>
          <input name="totalCount" type="number" defaultValue={formData.totalCount} required />
        </label>

        <label>
          <span>Available Count</span>
          <input name="availableCount" type="number" defaultValue={formData.availableCount} required />
        </label>

        <label>
          <span>Failed Count</span>
          <input name="failedCount" type="number" defaultValue={formData.failedCount} required />
        </label>

        <label>
          <span>Buy Date</span>
          <input name="buyDate" type="date" defaultValue={formData.buyDate?.slice(0, 10) || ''} />
        </label>

        <label className="full-span">
          <span>Note</span>
          <textarea name="note" defaultValue={formData.note || ''} rows="4" />
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-button">{isEditing ? 'Save Changes' : 'Create'}</button>
          <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  );
}

export default FlowerForm;
