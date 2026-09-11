// client/src/pages/VerifyEvidence.jsx

import { useState } from 'react';
import axios from 'axios';
import { ScanSearch, Loader2, XCircle, ShieldCheck, ShieldAlert, Link2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../utils/apiConfig';

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
        `${BASE_URL}/api/evidence/verify`,
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
      <div className="welcome-banner panel panel-static">
        <h2>Verify authenticity</h2>
        <p className="lede">Check a file fingerprint against the permanent blockchain record.</p>
      </div>

      <div className="info-section panel panel-static">
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>Case identifier</label>
            <input 
              type="text" 
              value={caseId} 
              onChange={(e) => setCaseId(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label>Select file to verify</label>
            <div className="file-upload-wrapper">
              <div className="file-input-custom">
                <input type="file" onChange={handleFileChange} required />
                <div className="file-info">
                  <ScanSearch size={28} />
                  <span>{fileHash ? 'File fingerprinted' : 'Drag a file here to compare its signature'}</span>
                  <small>The hash is checked against the blockchain record</small>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            {status === 'hashing' && <p className="status-text animate-fade"><Loader2 size={15} className="spin" /> Generating digital fingerprint…</p>}
            {status === 'verifying' && <p className="status-text animate-fade"><Loader2 size={15} className="spin" /> Querying blockchain records…</p>}
            {status === 'error' && <p className="status-error animate-fade"><XCircle size={15} /> {error}</p>}

            {result && (
              <div className={`verify-result panel panel-static animate-fade`} style={{ borderLeftColor: result.isMatch ? 'var(--stamp-green)' : 'var(--stamp-red)' }}>
                <h3 style={{ color: result.isMatch ? 'var(--stamp-green)' : 'var(--stamp-red)' }}>
                  {result.isMatch ? <ShieldCheck size={19} /> : <ShieldAlert size={19} />}
                  {result.isMatch ? 'Chain of custody verified' : 'Tampering detected'}
                </h3>
                
                {result.isMatch && result.txHash && (
                  <div className="hash-display" style={{ background: 'var(--stamp-green-tint)', borderColor: 'var(--stamp-green)' }}>
                    <label style={{ color: 'var(--stamp-green)' }}><Link2 size={12} /> Transaction proof</label>
                    <code style={{ fontSize: '0.75rem' }}>{result.txHash}</code>
                  </div>
                )}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={!fileHash || status === 'verifying' || status === 'hashing'}
          >
            Run verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEvidence;
