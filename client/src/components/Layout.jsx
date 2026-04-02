// client/src/components/Layout.jsx

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '📤', label: 'Upload', path: '/upload' },
  { icon: '🔍', label: 'Verify', path: '/verify' },
];

  return (
    <div className="layout-wrapper">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <span onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>⛓️</span>
          {!isCollapsed && "ForenXChain"}
        </div>
        
        <nav className="nav-links">
          {navItems.map((item) => (
            <div 
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : ''} 
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!isCollapsed && (
            <div style={{ marginBottom: '1.25rem', padding: '0 0.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>SIGNED IN AS</span>
              <p style={{ fontWeight: '600', margin: '0.2rem 0' }}>{user?.name}</p>
              <span className="status-badge info" style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>{user?.role}</span>
            </div>
          )}
          
          <button onClick={handleLogout} className="btn-logout">
            🚪 {!isCollapsed && "Logout"}
          </button>
        </div>
      </div>

      <main className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;

