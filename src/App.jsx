import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import FlowerPage from './pages/FlowerPage.jsx';
import SupplyPage from './pages/SupplyPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Error500Page from './pages/Error500Page.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import ToastContainer from './components/ToastContainer.jsx';
import { getFlowers, getSupplies } from './api.js';
import { getSession } from './session.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorCard from './components/ErrorCard.jsx';

function ProtectedRoute({ children }) {
  const session = getSession();

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function DashboardPage() {
  const [flowers, setFlowers] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [flowersData, suppliesData] = await Promise.all([getFlowers(), getSupplies()]);
        setFlowers(flowersData);
        setSupplies(suppliesData);
      } catch (err) {
        if (err?.status >= 500) {
          navigate('/error-500');
          return;
        }

        setError(err?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <section className="content-panel">
      <div className="panel-header">
        <h2>Dashboard</h2>
      </div>

      {loading && <p>Loading data...</p>}
      {error && <ErrorCard message={error} onClose={() => setError('')} />}

      {!loading && !error && <Dashboard flowers={flowers} supplies={supplies} />}
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="error-500" element={<Error500Page />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="flowers" element={<FlowerPage />} />
          <Route path="supplies" element={<SupplyPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
