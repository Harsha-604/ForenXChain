// client/src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, ScanSearch, FolderOpen, Users, CheckCircle2, Trash2 } from 'lucide-react';
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
      {/* Page header */}
      <div className="welcome-banner panel panel-static">
        <div className="role-stamp">{isAdmin ? 'Master admin' : 'Investigator'}</div>
        <h2>Welcome back, {user?.name}</h2>
        <p className="lede">
          {isAdmin
            ? 'Full override authority over the chain-of-custody records and personnel access.'
            : 'Your secured forensic fingerprints, and tools to verify the integrity of digital evidence.'}
        </p>
      </div>

      {/* Quick actions */}
      <div className="card-grid">
        <div className="action-card panel" onClick={() => navigate('/upload')}>
          <div className="card-icon"><Upload size={20} /></div>
          <div>
            <h3>Secure upload</h3>
            <p>Generate a SHA-256 fingerprint and commit it to the blockchain.</p>
          </div>
        </div>
        <div className="action-card panel" onClick={() => navigate('/verify')}>
          <div className="card-icon"><ScanSearch size={20} /></div>
          <div>
            <h3>Verify integrity</h3>
            <p>Cross-reference a file against the immutable ledger.</p>
          </div>
        </div>
      </div>

      {/* Data section */}
      <div className="data-section">
        {loading ? (
          <p className="status-text">Synchronizing with blockchain network…</p>
        ) : error ? (
          <p className="status-error">{error}</p>
        ) : (
          <div className="animate-fade">
            {/* EVIDENCE TABLE */}
            <div className="info-section panel panel-static">
              <div className="info-section-header">
                <FolderOpen size={18} />
                <h3>{isAdmin ? 'Global evidence ledger' : 'My evidence history'}</h3>
              </div>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>File name</th>
                      {isAdmin && <th>Uploaded by</th>}
                      <th>Timestamp</th>
                      <th>Blockchain proof</th>
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {evidence.map((ev) => (
                      <tr key={ev._id}>
                        <td className="cell-case">{ev.caseId}</td>
                        <td className="cell-file">{ev.fileName}</td>
                        {isAdmin && <td>{ev.uploadedBy?.name || 'Unknown'}</td>}
                        <td>{new Date(ev.timestamp).toLocaleDateString()}</td>
                        <td>
                          {ev.txHash ? (
                            <span className="status-badge success cell-hash" title={ev.txHash}>
                              <CheckCircle2 size={12} /> {ev.txHash.substring(0, 10)}… (B#{ev.blockNumber})
                            </span>
                          ) : (
                            <span className="status-badge info">Pending</span>
                          )}
                        </td>
                        {isAdmin && (
                          <td>
                            <button className="btn-delete" onClick={() => handleDeleteEvidence(ev._id)} title="Delete record">
                              <Trash2 size={15} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {evidence.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 6 : 4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-paper)' }}>
                          No forensic records in the local buffer yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* USERS TABLE (ADMIN ONLY) */}
            {isAdmin && (
              <div className="info-section panel panel-static" style={{ marginTop: '2rem' }}>
                <div className="info-section-header">
                  <Users size={18} />
                  <h3>Registered personnel</h3>
                </div>
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Personnel name</th>
                        <th>Email address</th>
                        <th>Access level</th>
                        <th>Authorized since</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="cell-file">{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`status-badge ${u.role === 'admin' ? 'success' : 'info'}`}>
                              {u.role}
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
