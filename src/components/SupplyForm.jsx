function SupplyForm({ supply, onSubmit, onCancel, isEditing }) {
  const defaultSupply = {
    name: '',
    price: 0,
    count: 0,
    note: ''
  };

  const formData = supply || defaultSupply;

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      name: event.target.name.value,
      price: Number(event.target.price.value),
      count: Number(event.target.count.value),
      note: event.target.note.value
    };

    onSubmit(payload);
  }

  return (
    <section className="panel form-panel">
      <div className="panel-header compact">
        <h2>{isEditing ? 'Edit Supply' : 'Create Supply'}</h2>
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
          <span>Count</span>
          <input name="count" type="number" defaultValue={formData.count} required />
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

export default SupplyForm;
