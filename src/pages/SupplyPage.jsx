import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import SupplyTable from '../components/SupplyTable.jsx';
import SupplyForm from '../components/SupplyForm.jsx';
import ErrorCard from '../components/ErrorCard.jsx';
import {
  createSupply,
  deleteSupply,
  getSupplies,
  updateSupply
} from '../api.js';
import { showToast } from '../toast.js';
import ConfirmModal from '../components/ConfirmModal.jsx';

function SupplyPage() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSupply, setEditingSupply] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

  async function loadSupplies() {
    try {
      const data = await getSupplies();
      setSupplies(data);
      setError('');
    } catch (err) {
      if (err?.status >= 500) {
        setError('Server error occurred.');
        return;
      }
      setError(err?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSupplies();
  }, []);

  async function handleCreate(payload) {
    try {
      const newSupply = await createSupply(payload);
      setSupplies((current) => [...current, newSupply]);
      setEditingSupply(null);
      showToast('Supply created', 'success');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(payload) {
    try {
      const updated = await updateSupply(editingSupply.id, payload);
      setSupplies((current) =>
        current.map((supply) => supply.id === editingSupply.id ? { ...supply, ...updated } : supply)
      );
      setEditingSupply(null);
      showToast('Supply updated', 'success');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSupply(id);
      setSupplies((current) => current.filter((supply) => supply.id !== id));
      showToast('Supply deleted', 'success');
    } catch (err) {
      setError(err.message);
    }
  }

  function requestDelete(supply) {
    setConfirmDelete({ open: true, id: supply.id, name: supply.name });
  }

  function cancelDelete() {
    setConfirmDelete({ open: false, id: null, name: '' });
  }

  async function confirmDeleteHandler() {
    if (!confirmDelete.id) return;
    await handleDelete(confirmDelete.id);
    cancelDelete();
  }

  return (
    <>
      <Dashboard supplies={supplies} />

      <section className="content-panel">
        <div className="panel-header">
          <h2>Supplies</h2>
          <button className="primary-button" onClick={() => setEditingSupply({})}>+ Add Supply</button>
        </div>

        {loading && <p>Loading data...</p>}
        {error && <ErrorCard message={error} onClose={() => setError('')} />}

        {editingSupply && (
          <SupplyForm
            supply={editingSupply.id ? editingSupply : null}
            isEditing={Boolean(editingSupply.id)}
            onSubmit={editingSupply.id ? handleUpdate : handleCreate}
            onCancel={() => setEditingSupply(null)}
          />
        )}

        {!loading && !error && (
          <SupplyTable
            supplies={supplies}
            onEdit={(supply) => setEditingSupply(supply)}
            onDelete={(id) => requestDelete(supplies.find(s => s.id === id) || { id })}
          />
        )}
      </section>
      <ConfirmModal
        open={confirmDelete.open}
        title="Delete supply"
        message={`Are you sure you want to delete "${confirmDelete.name}"?`}
        onConfirm={confirmDeleteHandler}
        onCancel={cancelDelete}
      />
    </>
  );
}

export default SupplyPage;
