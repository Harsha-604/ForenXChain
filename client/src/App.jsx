// client/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadEvidence from './pages/UploadEvidence';
import VerifyEvidence from './pages/VerifyEvidence';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — wrapped in PrivateRoute and Layout */}
        <Route path="/dashboard" element={
          <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
        } />
        <Route path="/upload" element={
          <PrivateRoute><Layout><UploadEvidence /></Layout></PrivateRoute>
        } />
        <Route path="/verify" element={
          <PrivateRoute><Layout><VerifyEvidence /></Layout></PrivateRoute>
        } />

        {/* Default: if logged in → dashboard, else → login */}
        <Route path="*" element={
          <Navigate to={user ? '/dashboard' : '/login'} replace />
        } />

      </Routes>
    </BrowserRouter>
  );
}


export default App;
