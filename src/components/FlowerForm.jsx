import { useState } from 'react';
import ErrorCard from './ErrorCard';
import ConfirmModal from './ConfirmModal';

function FlowerForm({ flower, onSubmit, onCancel, isEditing }) {
  const [formError, setFormError] = useState('');

  const defaultFlower = {
    name: '',
    price: '',
    totalCount: '',
    availableCount: '',
    failedCount: '',
    buyDate: '',
    note: ''
  };

  const formData = flower || defaultFlower;
  const [isDirty, setIsDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    setFormError('');

    const name = event.target.name.value.trim();
    const priceRaw = event.target.price.value;
    const totalCountRaw = event.target.totalCount.value;
    const availableCountRaw = event.target.availableCount.value;

    const missing = [];
    if (!name) missing.push('Name');
    if (priceRaw === '') missing.push('Price');
    if (totalCountRaw === '') missing.push('Total Count');
    if (availableCountRaw === '') missing.push('Available Count');
    if (event.target.buyDate.value === '') missing.push('Buy Date');

    if (missing.length) {
      setFormError(`Please fill required fields: ${missing.join(', ')}`);
      return;
    }

    const totalCount = Number(totalCountRaw);
    const availableCount = Number(availableCountRaw);
    if (availableCount > totalCount) {
      setFormError('Available Count cannot be greater than Total Count');
      return;
    }
    let failedCount = totalCount - availableCount;
    if (failedCount < 0) failedCount = 0;

    const payload = {
      name,
      price: Number(priceRaw),
      totalCount,
      availableCount,
      failedCount,
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
        <h2>{isEditing ? 'Edit Flower' : 'Add Flower'}</h2>
      </div>

      {formError && <ErrorCard message={formError} onClose={clearError} />}
      <form className="flower-form" onSubmit={handleSubmit} onChange={() => setIsDirty(true)}>
        <label>
          <span>Name</span>
          <input name="name" defaultValue={formData.name} required />
        </label>

        <label>
          <span>Price</span>
          <input name="price" type="number" step="0.01" inputMode="decimal" min="0" defaultValue={formData.price} required />
        </label>

        <label>
          <span>Total Count</span>
          <input name="totalCount" type="number" step="1" inputMode="numeric" min="0" defaultValue={formData.totalCount} required />
        </label>

        <label>
          <span>Available Count</span>
          <input name="availableCount" type="number" step="1" inputMode="numeric" min="0" defaultValue={formData.availableCount} required />
        </label>

        {/* Failed Count is computed as Total - Available and not editable */}

        <label>
          <span>Buy Date</span>
          <input name="buyDate" type="date" defaultValue={formData.buyDate?.slice(0, 10) || ''} required />
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

export default FlowerForm;
