// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

// Simplified version without jwt-decode
const ProtectedRoute = ({ children, allowedRoles }) => {
  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem('user'));
  } catch (err) {
    console.warn('Invalid user in sessionStorage');
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;