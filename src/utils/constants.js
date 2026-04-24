/**
 * @file constants.js
 * @description Constantes globales de la aplicación ToDo List Pro
 */

/** URL base de la API (JSON Server) */
export const API_BASE_URL = `http://${window.location.hostname}:3001`;

/** Endpoints disponibles */
export const ENDPOINTS = {
  USERS: '/users',
  TASKS: '/tasks',
  CATEGORIES: '/categories',
};

/** Clave de localStorage para sesión */
export const STORAGE_KEYS = {
  USER: 'todolist_user',
  THEME: 'todolist_theme',
};

/** Estados posibles de una tarea */
export const TASK_STATUS = {
  PENDING: 'pendiente',
  COMPLETED: 'completada',
};

/** Etiquetas de estados */
export const TASK_STATUS_LABELS = {
  pendiente: 'Pendiente',
  completada: 'Completada',
};

/** Opciones de días de alerta */
export const ALERT_DAYS_OPTIONS = [1, 2, 3, 5, 7, 10, 14, 30];

/** Categorías por defecto (respaldo si la API falla) */
export const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Trabajo', color: '#00e676' },
  { id: 2, name: 'Universidad', color: '#40c4ff' },
  { id: 3, name: 'Casa', color: '#ff6d00' },
  { id: 4, name: 'Compras', color: '#e040fb' },
];

/** Colores disponibles para nuevas categorías */
export const CATEGORY_COLORS = [
  '#00e676', '#40c4ff', '#ff6d00', '#e040fb',
  '#ffab40', '#ff5252', '#69f0ae', '#ea80fc',
  '#18ffff', '#b9f6ca', '#ccff90', '#ffd740',
];

/** Mensajes de error estándar */
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica que el servidor esté corriendo.',
  LOGIN_FAILED: 'Usuario o contraseña incorrectos.',
  REQUIRED_FIELDS: 'Por favor completa todos los campos requeridos.',
  INVALID_DATE: 'La fecha de fin no puede ser anterior a la fecha de inicio.',
  DELETE_ERROR: 'Error al eliminar la tarea. Intenta de nuevo.',
  CREATE_ERROR: 'Error al crear la tarea. Intenta de nuevo.',
  UPDATE_ERROR: 'Error al actualizar la tarea. Intenta de nuevo.',
  LOAD_ERROR: 'Error al cargar los datos. Intenta de nuevo.',
};

/** Mensajes de éxito */
export const SUCCESS_MESSAGES = {
  TASK_CREATED: '¡Tarea creada exitosamente!',
  TASK_UPDATED: '¡Tarea actualizada exitosamente!',
  TASK_DELETED: 'Tarea eliminada correctamente.',
  TASK_COMPLETED: '¡Tarea marcada como completada!',
  TASK_REOPENED: 'Tarea marcada como pendiente.',
  CATEGORY_CREATED: '¡Categoría creada exitosamente!',
  LOGIN_SUCCESS: '¡Bienvenido de vuelta!',
};
