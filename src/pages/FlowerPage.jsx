import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import ErrorCard from '../components/ErrorCard.jsx';
import FlowerTable from '../components/FlowerTable.jsx';
import FlowerForm from '../components/FlowerForm.jsx';
import {
  createFlower,
  deleteFlower,
  getFlowers,
  updateFlower
} from '../api.js';
import { showToast } from '../toast.js';
import ConfirmModal from '../components/ConfirmModal.jsx';

function FlowerPage() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingFlower, setEditingFlower] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

  async function loadFlowers() {
    try {
      const data = await getFlowers();
      setFlowers(data);
      setError('');
    } catch (err) {
      if (err?.status >= 500) {
        // navigate not available here; show generic server error card
        setError('Server error occurred.');
        return;
      }
      setError(err?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlowers();
  }, []);

  async function handleCreate(payload) {
    try {
      const newFlower = await createFlower(payload);
      setFlowers((current) => [...current, newFlower]);
      setEditingFlower(null);
      showToast('Flower created', 'success');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(payload) {
    try {
      const updated = await updateFlower(editingFlower.id, payload);
      setFlowers((current) =>
        current.map((flower) => flower.id === editingFlower.id ? { ...flower, ...updated } : flower)
      );
      setEditingFlower(null);
      showToast('Flower updated', 'success');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteFlower(id);
      setFlowers((current) => current.filter((flower) => flower.id !== id));
      showToast('Flower deleted', 'success');
    } catch (err) {
      setError(err.message);
    }
  }

  function requestDelete(flower) {
    setConfirmDelete({ open: true, id: flower.id, name: flower.name });
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
      <Dashboard flowers={flowers} />

      <section className="content-panel">
        <div className="panel-header">
          <h2>Flowers</h2>
          <button className="primary-button" onClick={() => setEditingFlower({})}>+ Add Flower</button>
        </div>

        {loading && <p>Loading data...</p>}
        {error && <ErrorCard message={error} onClose={() => setError('')} />}

        {editingFlower && (
          <FlowerForm
            flower={editingFlower.id ? editingFlower : null}
            isEditing={Boolean(editingFlower.id)}
            onSubmit={editingFlower.id ? handleUpdate : handleCreate}
            onCancel={() => setEditingFlower(null)}
          />
        )}

        {!loading && !error && (
          <FlowerTable
            flowers={flowers}
            onEdit={(flower) => setEditingFlower(flower)}
            onDelete={(id) => requestDelete(flowers.find(f => f.id === id) || { id })}
          />
        )}
      </section>
      <ConfirmModal
        open={confirmDelete.open}
        title="Delete flower"
        message={`Are you sure you want to delete "${confirmDelete.name}"?`}
        onConfirm={confirmDeleteHandler}
        onCancel={cancelDelete}
      />
    </>
  );
}

export default FlowerPage;
