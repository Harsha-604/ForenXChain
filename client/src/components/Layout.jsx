// client/src/components/Layout.jsx

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutGrid, Upload, ScanSearch, LogOut, Link2 } from 'lucide-react';
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
    { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: ScanSearch, label: 'Verify', path: '/verify' },
  ];

  return (
    <div className="layout-wrapper">
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo" onClick={() => setIsCollapsed(!isCollapsed)}>
          <span className="sidebar-logo-mark"><Link2 size={16} /></span>
          {!isCollapsed && 'ForenXChain'}
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : ''}
            >
              <span className="nav-icon"><item.icon size={18} /></span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="sidebar-user-label">Signed in as</span>
            <p className="sidebar-user-name">{user?.name}</p>
            <span className="status-badge info">{user?.role}</span>
          </div>

          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} /> {!isCollapsed && <span className="logout-text">Logout</span>}
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
