// client/src/components/PrivateRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  // If not logged in → redirect to login page
  // If logged in → render the actual page
  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
