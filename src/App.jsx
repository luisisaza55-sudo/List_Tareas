/**
 * @file App.jsx
 * @description Componente raíz de la aplicación
 * Configura: proveedores de contexto, router y notificaciones toast
 */

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import AppRouter from './routes/AppRouter';

/**
 * Configuración global del sistema de toast notifications
 */
const TOAST_CONFIG = {
  duration: 3500,
  position: 'top-right',
  style: {
    background: '#141c2e',
    color: '#f0f4ff',
    border: '1px solid #1e2d4a',
    borderRadius: '12px',
    fontSize: '0.88rem',
    fontFamily: 'Inter, sans-serif',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },
  success: {
    iconTheme: {
      primary: '#00e676',
      secondary: '#0a0e1a',
    },
    style: {
      borderColor: 'rgba(0, 230, 118, 0.3)',
    },
  },
  error: {
    iconTheme: {
      primary: '#ff5252',
      secondary: '#0a0e1a',
    },
    style: {
      borderColor: 'rgba(255, 82, 82, 0.3)',
    },
  },
};

const App = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppRouter />
        <Toaster toastOptions={TOAST_CONFIG} />
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
