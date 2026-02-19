import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  const sessionTime = localStorage.getItem('adminSession');
  
  // Verificar si la sesión expiró (24 horas)
  if (sessionTime) {
    const now = Date.now();
    const sessionAge = now - parseInt(sessionTime);
    const hoursPassed = sessionAge / (1000 * 60 * 60);
    
    if (hoursPassed > 24) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminSession');
      return <Navigate to="/login" replace />;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;