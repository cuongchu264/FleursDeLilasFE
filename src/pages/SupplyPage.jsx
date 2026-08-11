import { useEffect, useState } from 'react';
import SupplyTable from '../components/SupplyTable.jsx';
import SupplyCardList from '../components/SupplyCardList.jsx';
import SupplyForm from '../components/SupplyForm.jsx';
import {
  createSupply,
  deleteSupply,
  getSupplies,
  updateSupply
} from '../api.js';

function SupplyPage() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSupply, setEditingSupply] = useState(null);

  async function loadSupplies() {
    try {
      const data = await getSupplies();
      setSupplies(data);
      setError('');
    } catch (err) {
      setError(err.message);
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
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteSupply(id);
      setSupplies((current) => current.filter((supply) => supply.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="content-panel">
      <div className="panel-header">
        <h2>Supplies</h2>
        <button className="primary-button" onClick={() => setEditingSupply({})}>+ Add Supply</button>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="error-text">{error}</p>}

      {editingSupply && (
        <SupplyForm
          supply={editingSupply.id ? editingSupply : null}
          isEditing={Boolean(editingSupply.id)}
          onSubmit={editingSupply.id ? handleUpdate : handleCreate}
          onCancel={() => setEditingSupply(null)}
        />
      )}

      {!loading && !error && (
        <>
          <div className="view-mode-wrapper">
            <span className="mode-label">Card View</span>
          </div>
          <SupplyCardList
            supplies={supplies}
            onEdit={(supply) => setEditingSupply(supply)}
            onDelete={handleDelete}
          />
          <SupplyTable
            supplies={supplies}
            onEdit={(supply) => setEditingSupply(supply)}
            onDelete={handleDelete}
          />
        </>
      )}
    </section>
  );
}

export default SupplyPage;
