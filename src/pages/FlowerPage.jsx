import { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import FlowerTable from '../components/FlowerTable.jsx';
import FlowerForm from '../components/FlowerForm.jsx';
import {
  createFlower,
  deleteFlower,
  getFlowers,
  updateFlower
} from '../api.js';

function FlowerPage() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingFlower, setEditingFlower] = useState(null);

  async function loadFlowers() {
    try {
      const data = await getFlowers();
      setFlowers(data);
      setError('');
    } catch (err) {
      setError(err.message);
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
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteFlower(id);
      setFlowers((current) => current.filter((flower) => flower.id !== id));
    } catch (err) {
      setError(err.message);
    }
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
        {error && <p className="error-text">{error}</p>}

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
            onDelete={handleDelete}
          />
        )}
      </section>
    </>
  );
}

export default FlowerPage;
