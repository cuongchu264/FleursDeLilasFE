import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearSession, getSession } from '../session.js';

function Layout() {
  const navigate = useNavigate();
  const session = getSession();

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <span className="brand-kicker">Fleurs de Lilas</span>
          <h1>Flower Management</h1>
        </div>
        <nav className="main-nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/flowers">Flowers</NavLink>
          <NavLink to="/supplies">Supplies</NavLink>
        </nav>

        <div className="user-bar">
          <span className="username-text">{session?.user?.username || 'User'}</span>
          <button className="secondary-button small-button logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default Layout;
