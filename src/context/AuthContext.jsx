/**
 * @file AuthContext.jsx
 * @description Contexto global de autenticación
 * Provee: usuario actual, funciones login/logout, estado de carga
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, logoutUser, getStoredUser } from '../services/authService';
import { SUCCESS_MESSAGES } from '../utils/constants';
import toast from 'react-hot-toast';

/** Contexto de autenticación */
const AuthContext = createContext(null);

/**
 * Proveedor de autenticación
 * Envuelve la aplicación y provee el estado de sesión globalmente
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  /**
   * Inicia sesión con email y contraseña
   * @param {string} email
   * @param {string} password
   * @returns {Promise<boolean>} true si fue exitoso
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const authenticatedUser = await loginUser(email, password);
      setUser(authenticatedUser);
      toast.success(`${SUCCESS_MESSAGES.LOGIN_SUCCESS} ${authenticatedUser.name} 👋`, {
        duration: 3000,
      });
      return true;
    } catch (error) {
      const message = error.message || 'Error al iniciar sesión.';
      setAuthError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cierra la sesión del usuario actual
   */
  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setAuthError(null);
    toast('Sesión cerrada. ¡Hasta pronto!', {
      icon: '👋',
      style: {
        background: '#141c2e',
        color: '#f0f4ff',
        border: '1px solid #1e2d4a',
      },
    });
  }, []);

  /**
   * Limpia el error de autenticación
   */
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    login,
    logout,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para consumir el contexto de autenticación
 * @returns {Object} Valores y funciones de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
};

export default AuthContext;
