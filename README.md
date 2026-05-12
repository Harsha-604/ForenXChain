<div align="center">

# 🔗 ForenXChain

### Blockchain-Based Digital Evidence Chain of Custody

A full-stack web application for securely managing digital forensic evidence using blockchain technology. Evidence files are hashed with **SHA-256** and the hash is stored on an **Ethereum smart contract** — creating an immutable, tamper-proof chain of custody.

</div>

---

## 🌐 Live Demo

**[https://foren-x-chain.vercel.app](https://foren-x-chain.vercel.app)**

---

## 📌 Overview

Digital forensic investigations depend on the integrity of evidence. Traditional systems are vulnerable to tampering, unauthorized modification, and unreliable audit trails. **ForenXChain** solves this by combining a modern web interface with the immutability of blockchain:

1. An investigator uploads a digital evidence file
2. The system computes its **SHA-256 hash fingerprint**
3. The hash is committed to an **Ethereum smart contract** — permanent and immutable
4. Evidence metadata is stored in **MongoDB** for querying and management
5. At any time, a file can be **re-verified** by comparing its current hash against the on-chain record

This guarantees that any tampering — even a single bit change — is immediately detectable.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure login/register with role-based access control |
| 📤 **Evidence Upload** | SHA-256 hashing + blockchain commit + MongoDB metadata storage |
| ✅ **Evidence Verification** | Re-upload any file to verify its hash against the immutable chain |
| 🛡️ **Admin Dashboard** | View all evidence across all users, manage personnel, delete records |
| 🔍 **Investigator Dashboard** | Personal evidence history with tx hash and block number proof |
| 📱 **Responsive Design** | Sidebar on desktop → bottom navigation on mobile (≤768px) |
| 🎨 **Glassmorphism UI** | Dark theme with blur effects, glow animations, and card-based layout |

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) — fast, component-based UI
- **Vanilla CSS** — custom design system with glassmorphism dark theme
- **Google Fonts** — Outfit, JetBrains Mono
- **Deployed on** — [Vercel](https://vercel.com)

### Backend
- **Node.js + Express.js** — REST API
- **MongoDB + Mongoose** — evidence metadata and user storage
- **JWT** — stateless authentication

### Blockchain
- **Solidity** — `EvidenceStore.sol` smart contract
- **Hardhat** — development, testing, and deployment

---

## 👥 Roles & Permissions

| Permission | Admin | Investigator |
|---|:---:|:---:|
| Upload evidence | ✅ | ✅ |
| Verify evidence | ✅ | ✅ |
| View own evidence history | ✅ | ✅ |
| View all users' evidence | ✅ | ❌ |
| Manage personnel | ✅ | ❌ |
| Delete records | ✅ | ❌ |

---

## 📁 Project Structure

```
ForenXChain/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UploadEvidence.jsx
│   │   │   └── VerifyEvidence.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Sidebar (desktop) / bottom nav (mobile)
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── apiConfig.js
│   │   │   └── contract.js
│   │   ├── index.css              # Full design system + mobile responsive
│   │   └── App.jsx                # Router setup
│
├── server/                        # Express backend
│   ├── index.js                   # Entry point (Express + MongoDB)
│   ├── routes/
│   │   ├── auth.js                # Login / Register
│   │   ├── evidence.js            # Upload, fetch evidence
│   │   └── admin.js               # Admin-only routes
│   ├── models/
│   │   ├── User.js
│   │   └── Evidence.js
│   ├── middleware/
│   │   └── auth.js                # JWT middleware
│   └── .env                       # MONGO_URI, JWT_SECRET, etc.
│
├── contracts/
│   └── EvidenceStore.sol          # Solidity smart contract
├── test/
│   └── Lock.js
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- MetaMask browser extension
- Hardhat

### 1. Clone the Repository

```bash
git clone https://github.com/Harsha-604/ForenXChain.git
cd ForenXChain
```

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the server:

```bash
node index.js
```

### 3. Deploy the Smart Contract

```bash
# From root directory
npm install
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

Copy the deployed contract address into `client/src/utils/contract.js`.

### 4. Set Up the Frontend

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔐 How It Works

```
User uploads file
      │
      ▼
SHA-256 hash computed in browser
      │
      ├──► Hash + tx committed to EvidenceStore.sol (blockchain)
      │
      └──► Metadata (filename, case ID, timestamp, uploader) saved to MongoDB

Later — Verification:
User re-uploads file → new hash computed → compared against on-chain hash → MATCH / TAMPERED
```

### Smart Contract — `EvidenceStore.sol`

The contract stores a mapping of evidence hashes to their submission details (timestamp, submitter address). Once written, the record **cannot be modified or deleted** — this is the core integrity guarantee.
