/**
 * @file authService.js
 * @description Servicio de autenticación
 * Maneja login, logout y persistencia de sesión en localStorage
 */

import api from './api';
import { ENDPOINTS, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

/**
 * Intenta autenticar un usuario contra la API
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Usuario autenticado
 * @throws {Error} Si las credenciales son incorrectas o hay error de red
 */
export const loginUser = async (email, password) => {
  const response = await api.get(ENDPOINTS.USERS, {
    params: { email },
  });

  const users = response.data;

  // Busca coincidencia exacta de email y password
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
  );

  if (!user) {
    throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
  }

  // Excluye la contraseña del objeto guardado (seguridad básica)
  const { password: _pwd, ...safeUser } = user;

  // Persiste sesión en localStorage
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));

  return safeUser;
};

/**
 * Cierra la sesión del usuario actual
 */
export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Recupera la sesión guardada en localStorage
 * @returns {Object|null} Usuario o null si no hay sesión
 */
export const getStoredUser = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Verifica si hay una sesión activa
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return getStoredUser() !== null;
};
