// client/src/components/Layout.jsx

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: '📊 Dashboard', path: '/dashboard' },
    { label: '📤 Upload', path: '/upload' },
    { label: '🔍 Verify', path: '/verify' },
  ];

  return (
    <div className="layout-wrapper">
      <div className="sidebar">
        <div className="sidebar-logo">
          <span>⛓️</span> ForenXChain
        </div>
        
        <nav className="nav-links">
          {navItems.map((item) => (
            <div 
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ marginBottom: '1.25rem', padding: '0 0.5rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>SIGNED IN AS</span>
            <p style={{ fontWeight: '600', margin: '0.2rem 0' }}>{user?.name}</p>
            <span className="status-badge info" style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>{user?.role}</span>
          </div>
          
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
