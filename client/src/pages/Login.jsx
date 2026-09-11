// client/src/pages/Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../utils/apiConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();       // Prevent page reload on form submit
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password
      });

      login(data);            // Save user + token to AuthContext & localStorage
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-side">
        <div className="auth-side-mark"><Link2 size={26} /></div>
        <h1>ForenXChain</h1>
        <p>Digital evidence, hashed and committed to an immutable ledger, so every chain of custody holds up.</p>
        <div className="auth-side-footer">SHA-256 · Ethereum · MongoDB</div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Sign in</h2>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            No account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
