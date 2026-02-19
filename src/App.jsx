import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicPage from './PublicPage';
import AdminPage from './AdminPages';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Página pública del Raspa y Gana */}
        <Route path="/" element={<PublicPage />} />
        
        {/* Página de login */}
        <Route path="/login" element={<Login />} />
        
        {/* Panel de administración (protegido) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Redireccionar rutas no encontradas a la página principal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
