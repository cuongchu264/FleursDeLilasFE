import { useState } from 'react';
import ErrorCard from './ErrorCard';
import ConfirmModal from './ConfirmModal';

function SupplyForm({ supply, onSubmit, onCancel, isEditing }) {
  const [formError, setFormError] = useState('');

  const defaultSupply = {
    name: '',
    price: '',
    count: '',
    note: ''
  };

  const formData = supply || defaultSupply;
  const [isDirty, setIsDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    setFormError('');

    const name = event.target.name.value.trim();
    const priceRaw = event.target.price.value;
    const countRaw = event.target.count.value;

    const missing = [];
    if (!name) missing.push('Name');
    if (priceRaw === '') missing.push('Price');
    if (countRaw === '') missing.push('Total');
    if (event.target.buyDate.value === '') missing.push('Buy Date');

    if (missing.length) {
      setFormError(`Please fill required fields: ${missing.join(', ')}`);
      return;
    }

    const payload = {
      name,
      price: Number(priceRaw),
      count: Number(countRaw),
      buyDate: event.target.buyDate.value,
      note: event.target.note.value
    };

    onSubmit(payload);
  }

  function clearError() {
    setFormError('');
  }

  function handleCancelClick() {
    if (isDirty) {
      setConfirmOpen(true);
      return;
    }
    onCancel();
  }

  function confirmCancel() {
    setConfirmOpen(false);
    onCancel();
  }

  return (
    <section className="panel form-panel">
      <div className="panel-header compact">
        <h2>{isEditing ? 'Edit Supply' : 'Add Supply'}</h2>
      </div>

      {formError && <ErrorCard message={formError} onClose={clearError} />}
      <form className="supply-form" onSubmit={handleSubmit} onChange={() => setIsDirty(true)}>
        <label>
          <span>Name</span>
          <input name="name" defaultValue={formData.name} required />
        </label>

        <label>
          <span>Price</span>
          <input name="price" type="number" step="0.01" inputMode="decimal" min="0" defaultValue={formData.price} required />
        </label>

        <label>
          <span>Total</span>
          <input name="count" type="number" step="1" inputMode="numeric" min="0" defaultValue={formData.count} required />
        </label>

        <label>
          <span>Buy Date</span>
          <input name="buyDate" type="date" defaultValue={formData.buyDate?.slice ? formData.buyDate.slice(0,10) : formData.buyDate || ''} required />
        </label>

        <label className="full-span">
          <span>Note</span>
          <textarea name="note" defaultValue={formData.note || ''} rows="4" />
        </label>

        <div className="form-actions">
          <button type="submit" className="primary-button">{isEditing ? 'Save Changes' : 'Create'}</button>
          <button type="button" className="secondary-button" onClick={handleCancelClick}>Cancel</button>
        </div>
      </form>

      <ConfirmModal
        open={confirmOpen}
        title="Discard changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        onConfirm={confirmCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}

export default SupplyForm;
