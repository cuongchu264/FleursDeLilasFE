import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api.js';
import ErrorCard from '../components/ErrorCard.jsx';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await register({ username, password });

      if (!result.success) {
        setError(result.message || 'Registration failed');
        return;
      }

      setSuccess('Registration successful. Please sign in.');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      if (err?.status >= 500) {
        navigate('/error-500');
        return;
      }

      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-box">
        <div className="login-header">
          <span className="brand-kicker">Fleurs de Lilas</span>
          <h1>Create account</h1>
          <p>Register a new user</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              minLength="3"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength="6"
            />
          </label>

          {error && <ErrorCard message={error} onClose={() => setError('')} />}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>

          <p className="auth-link">
            <span>Already have an account?</span>{' '}
            <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default RegisterPage;
