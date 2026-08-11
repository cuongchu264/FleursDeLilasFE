import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api.js';
import { saveSession } from '../session.js';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const result = await login({ username, password });

      if (!result.success) {
        setError(result.message || 'Login failed');
        return;
      }

      saveSession({
        user: result.user,
        token: result.token,
        loggedInAt: new Date().toISOString()
      });

      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-box">
        <div className="login-header">
          <span className="brand-kicker">Fleurs de Lilas</span>
          <h1>Welcome back</h1>
          <p>Please sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>

          <p className="auth-link">
            <span>New here?</span>{' '}
            <Link to="/register">Create account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
