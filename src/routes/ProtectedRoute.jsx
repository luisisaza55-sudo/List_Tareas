/**
 * @file ProtectedRoute.jsx
 * @description Componente de ruta protegida
 * Redirige al login si el usuario no está autenticado
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader/Loader';

/**
 * Envuelve rutas que requieren autenticación
 * @param {ReactNode} children - Componente hijo a renderizar
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen message="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    // Guarda la ruta original para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
