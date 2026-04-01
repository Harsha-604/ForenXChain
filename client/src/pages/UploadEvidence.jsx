// client/src/pages/UploadEvidence.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ethers } from 'ethers';
import { useAuth } from '../context/AuthContext';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

const computeFileHash = async (file) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const UploadEvidence = () => {
  const [caseId, setCaseId] = useState('');
  const [file, setFile] = useState(null);
  const [fileHash, setFileHash] = useState('');
  const [status, setStatus] = useState(''); 
  const [error, setError] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setStatus('hashing');
    try {
      const hash = await computeFileHash(selected);
      setFileHash(hash);
      setStatus('');
    } catch {
      setError('Failed to hash file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.ethereum) return alert('Please install MetaMask');

    setStatus('storing-on-chain');
    setError('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      let receipt;
      try {
        const tx = await contract.storeEvidence(caseId, fileHash, file.name, file.type);
        setStatus('waiting-for-block');
        receipt = await tx.wait();
      } catch (bcError) {
        throw new Error(`Blockchain Error: ${bcError.reason || bcError.message}`);
      }

      setStatus('saving-to-db');
      await axios.post(
        'http://localhost:5000/api/evidence/upload',
        {
          caseId,
          fileName: file.name,
          fileType: file.type,
          fileHash,
          txHash: receipt.hash,
          blockNumber: Number(receipt.blockNumber)
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Action failed');
      setStatus('error');
    }
  };

  return (
    <div className="animate-fade">
      <div className="welcome-banner glass-card">
        <h2>📤 Upload New Evidence</h2>
        <p>Register a permanent file fingerprint on the Ethereum blockchain.</p>
      </div>

      <div className="info-section glass-card" style={{ maxWidth: 'auto' }}>
        <form onSubmit={handleSubmit}>
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
            <label>Evidence Source (File)</label>
            <div className="file-upload-wrapper">
              <div className="file-input-custom">
                <input type="file" onChange={handleFileChange} required />
                <div className="file-info">
                  <div style={{ fontSize: '2rem' }}>📁</div>
                  <span>{file ? file.name : 'Click or Drag file to securely hash'}</span>
                  <small>SHA-256 fingerprint will be generated automatically</small>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>

            {status === 'hashing' && <p className="status-text animate-fade">⏳ Computing forensic signature...</p>}
            {status === 'storing-on-chain' && <p className="status-text animate-fade">⛓️ Proposing Block Transaction (Awaiting Signature)...</p>}
            {status === 'waiting-for-block' && <p className="status-text animate-fade">🛠️ Mining transaction record on Ethereum...</p>}
            {status === 'saving-to-db' && <p className="status-text animate-fade">💾 Indexing record in forensic database...</p>}
            {status === 'success' && <p className="status-success animate-fade">✅ Evidence secured! Redirecting...</p>}
            {status === 'error' && <p className="status-error animate-fade">❌ {error}</p>}
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={!fileHash || ['hashing', 'storing-on-chain', 'waiting-for-block', 'saving-to-db'].includes(status)}
          >
            Authenticate & Secure Evidence
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadEvidence;
