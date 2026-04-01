// client/src/pages/VerifyEvidence.jsx

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const computeFileHash = async (file) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const VerifyEvidence = () => {
  const [caseId, setCaseId] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const { user } = useAuth();

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setStatus('hashing');
    try {
      const hash = await computeFileHash(selected);
      setFileHash(hash);
      setStatus('');
      setResult(null);
    } catch {
      setError('Failed to hash file');
      setStatus('error');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!fileHash || !caseId) return;

    setStatus('verifying');
    setError('');
    setResult(null);

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/evidence/verify',
        { caseId, fileHash },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setResult(data);
      setStatus('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      setStatus('error');
    }
  };

  return (
    <div className="animate-fade">
      <div className="welcome-banner glass-card">
        <h2>🔍 Verify Authenticity</h2>
        <p>Verify a file fingerprint against the permanent blockchain database.</p>
      </div>

      <div className="info-section glass-card" style={{ maxWidth: 'auto' }}>
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>Case Identifier</label>
            <input 
              type="text" 
              value={caseId} 
              onChange={(e) => setCaseId(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label>Select File to Verify</label>
            <div className="file-upload-wrapper">
              <div className="file-input-custom">
                <input type="file" onChange={handleFileChange} required />
                <div className="file-info">
                  <div style={{ fontSize: '2rem' }}>🔎</div>
                  <span>{fileHash ? 'File Fingeprinted' : 'Drag file here to compare signature'}</span>
                  <small>The hash will be checked against the blockchain records</small>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            {status === 'hashing' && <p className="status-text animate-fade">⏳ Generating digital fingerprint...</p>}
            {status === 'verifying' && <p className="status-text animate-fade">⏳ Querying blockchain records...</p>}
            {status === 'error' && <p className="status-error animate-fade">❌ {error}</p>}

            {result && (
              <div className={`verify-result glass-card animate-fade ${result.isMatch ? 'match' : 'no-match'}`} style={{ borderLeftWidth: '5px', borderRadius: '8px' }}>
                <h3 style={{ color: result.isMatch ? 'var(--success)' : 'var(--danger)', marginBottom: '1rem' }}>
                  {result.isMatch ? '✅ CHAIN OF CUSTODY VERIFIED' : '❌ TAMPERING DETECTED'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {result.isMatch && result.txHash && (
                    <div className="hash-display" style={{ background: 'rgba(63, 185, 80, 0.05)', borderColor: 'var(--success)' }}>
                      <label style={{ fontSize: '0.70rem', color: 'var(--success)', display: 'block', marginBottom: '0.2rem' }}>⛓️ TRANSACTION PROOF</label>
                      <code style={{ fontSize: '0.75rem' }}>{result.txHash}</code>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={!fileHash || status === 'verifying' || status === 'hashing'}
          >
            Execute Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEvidence;
