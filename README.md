# ForenXChain (Lite)

ForenXChain is a secure, blockchain-backed Digital Evidence Chain of Custody System. It allows investigators and authorized personnel to upload, track, and verify the integrity of digital evidence using blockchain technology and centralized storage.

## 🚀 Features

- **Decentralized Integrity**: Records evidence metadata and transaction hashes on the blockchain to prevent tampering.
- **Role-Based Access Control**: Secure login and authorization for Investigators and Administrators.
- **Evidence Management**: Upload evidence files, track their status, and maintain a verifiable audit trail.
- **Blockchain Verification**: Seamlessly verify the authenticity of stored records against blockchain data.
- **Modern UI**: A responsive and intuitive dashboard built with React and Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State/API**: Axios, Ethers.js

### Backend
- **Framework**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
- **Security**: JWT (JSON Web Tokens), BcryptJS
- **Blockchain Interface**: [Ethers.js](https://docs.ethers.org/)

### Smart Contracts (Blockchain)
- **Environment**: [Hardhat](https://hardhat.org/)
- **Language**: [Solidity](https://soliditylang.org/)

## 📂 Project Structure

```bash
ForenXChain/
├── client/           # Frontend React application
├── server/           # Backend Node.js API
├── contracts/        # Solidity smart contracts
├── ignition/         # Hardhat deployment modules (Hardhat Ignition)
├── scripts/          # Helper scripts for deployment/interaction
├── test/             # Smart contract tests
└── hardhat.config.js # Hardhat configuration
```

## ⚙️ Prerequisites

- **Node.js**: (v16+ recommended)
- **npm** or **yarn**
- **MongoDB**: A running MongoDB instance (Local or Atlas)
- **MetaMask** or a similar Ethereum wallet (for local Hardhat interaction if needed)

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ForenXChain.git
   cd ForenXChain
   ```

2. **Install Root Dependencies (Hardhat):**
   ```bash
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

5. **Configure Environment Variables:**
   Create a `.env` file in the `server/` directory with the following:
   ```env
   PORT=PORT_NUMBER
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PRIVATE_KEY=your_wallet_private_key
   RPC_URL=your_blockchain_rpc_url
   CONTRACT_ADDRESS=your_deployed_contract_address
   ```

## 🚀 Running the Project

### 1. Start Local Blockchain (Optional for local testing)
```bash
npx hardhat node
```

### 2. Deploy Smart Contracts
```bash
npx hardhat ignition deploy ./ignition/modules/EvidenceStore.js --network localhost
```

### 3. Start Backend Server
```bash
cd server
npm run dev
```

### 4. Start Frontend Client
```bash
cd client
npm run dev
```
## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.