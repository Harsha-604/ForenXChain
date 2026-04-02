// client/src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../utils/apiConfig';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [evidence, setEvidence] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      if (isAdmin) {
        const [evResponse, usersResponse] = await Promise.all([
          axios.get(`${BASE_URL}/api/evidence/all`, config),
          axios.get(`${BASE_URL}/api/admin/users`, config)
        ]);
        setEvidence(evResponse.data);
        setUsers(usersResponse.data);
      } else {
        const response = await axios.get(`${BASE_URL}/api/evidence/mine`, config);
        setEvidence(response.data);
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvidence = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`${BASE_URL}/api/evidence/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchDashboardData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="animate-fade">
      {/* Action Banner */}
      <div className="welcome-banner glass-card">
        <h2>Welcome back, {user?.name} 👋</h2>
        <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
          {isAdmin ? "MASTER ADMINISTRATIVE PORTAL" : "INVESTIGATOR DASHBOARD"}
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '600px' }}>
          {isAdmin 
            ? "You have full override authority over the digital chain of custody records and personnel access." 
            : "Access your secured forensic fingerprints and verify the integrity of digital evidence."}
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="card-grid">
        <div className="action-card glass-card" onClick={() => navigate('/upload')}>
          <div className="card-icon">📤</div>
          <h3>Secure Upload</h3>
          <p>Generate SHA-256 fingerprints and commit to blockchain.</p>
        </div>
        <div className="action-card glass-card" onClick={() => navigate('/verify')}>
          <div className="card-icon">🔍</div>
          <h3>Verify Integrity</h3>
          <p>Instant cross-reference against immutable ledger.</p>
        </div>
      </div>

      {/* Data Visualisation Section */}
      <div className="data-section">
        {loading ? (
          <p className="status-text">Synchronizing with blockchain network...</p>
        ) : error ? (
          <p className="status-error">{error}</p>
        ) : (
          <div className="animate-fade">
            {/* EVIDENCE TABLE */}
            <div className="info-section glass-card">
              <h3>{isAdmin ? "📂 Global Evidence Ledger" : "📂 My Evidence History"}</h3>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>File Name</th>
                      {isAdmin && <th>Uploaded By</th>}
                      <th>Timestamp</th>
                      <th>Blockchain Proof</th>
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {evidence.map((ev) => (
                      <tr key={ev._id}>
                        <td style={{ color: 'var(--primary)', fontWeight: '600' }}>{ev.caseId}</td>
                        <td style={{ fontWeight: '500' }}>{ev.fileName}</td>
                        {isAdmin && <td>{ev.uploadedBy?.name || 'Unknown'}</td>}
                        <td>{new Date(ev.timestamp).toLocaleDateString()}</td>
                        <td>
                          {ev.txHash ? (
                            <span className="status-badge success" title={ev.txHash}>
                              ✅ {ev.txHash.substring(0, 10)}... (B#{ev.blockNumber})
                            </span>
                          ) : (
                            <span className="status-badge info">Pending</span>
                          )}
                        </td>
                        {isAdmin && (
                          <td>
                            <button className="btn-delete" onClick={() => handleDeleteEvidence(ev._id)} title="Delete Record">🗑️</button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {evidence.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 6 : 4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
                          No forensic records detected in the local buffer.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* USERS TABLE (ADMIN ONLY) */}
            {isAdmin && (
              <div className="info-section glass-card" style={{ marginTop: '2.5rem' }}>
                <h3>👥 Registered Personnel</h3>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Personnel Name</th>
                        <th>Email Address</th>
                        <th>Access Level</th>
                        <th>Authorized Since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td style={{ fontWeight: '600' }}>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`status-badge ${u.role === 'admin' ? 'success' : 'info'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
