import { useEffect, useState } from 'react';
import SupplyTable from '../components/SupplyTable.jsx';
import { getSupplies } from '../api.js';

function SupplyPage() {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSupplies() {
      try {
        const data = await getSupplies();
        setSupplies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSupplies();
  }, []);

  return (
    <section className="content-panel">
      <div className="panel-header">
        <h2>Supplies</h2>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && <SupplyTable supplies={supplies} />}
    </section>
  );
}

export default SupplyPage;
