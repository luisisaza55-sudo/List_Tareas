/**
 * @file api.js
 * @description Instancia base de Axios con interceptores globales
 * Capa de transporte HTTP centralizada para toda la aplicación
 */

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/** Instancia principal de Axios configurada para JSON Server */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Interceptor de REQUEST
 * Permite agregar tokens de autenticación u otros headers en el futuro
 */
api.interceptors.request.use(
  (config) => {
    // En producción real aquí se adjuntaría el JWT token
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de RESPONSE
 * Maneja errores globales de red y respuestas inesperadas
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Sin respuesta del servidor → problema de red o CORS
      return Promise.reject({
        message: 'Error de conexión. Verifica que JSON Server esté corriendo en el puerto 3001.',
        isNetworkError: true,
      });
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        return Promise.reject({ message: data?.message || 'Solicitud incorrecta.' });
      case 401:
        return Promise.reject({ message: 'No autorizado. Inicia sesión de nuevo.' });
      case 403:
        return Promise.reject({ message: 'Acceso denegado.' });
      case 404:
        return Promise.reject({ message: 'Recurso no encontrado.' });
      case 500:
        return Promise.reject({ message: 'Error interno del servidor.' });
      default:
        return Promise.reject({ message: data?.message || 'Error inesperado.' });
    }
  }
);

export default api;
