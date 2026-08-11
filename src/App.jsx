import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import FlowerPage from './pages/FlowerPage.jsx';
import SupplyPage from './pages/SupplyPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import { getFlowers } from './api.js';
import { getSession } from './session.js';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
  const session = getSession();

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function DashboardPage() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFlowers() {
      try {
        const data = await getFlowers();
        setFlowers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFlowers();
  }, []);

  return (
    <section className="content-panel">
      <div className="panel-header">
        <h2>Dashboard</h2>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && <Dashboard flowers={flowers} />}
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="flowers" element={<FlowerPage />} />
          <Route path="supplies" element={<SupplyPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
