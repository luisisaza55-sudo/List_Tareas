/**
 * @file AppRouter.jsx
 * @description Configuración central de rutas con React Router DOM
 * Define la estructura de navegación de toda la aplicación
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../pages/NotFound/NotFound';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige raíz al dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Ruta pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida del dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 - Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
