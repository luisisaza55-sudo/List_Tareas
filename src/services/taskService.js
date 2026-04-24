/**
 * @file taskService.js
 * @description Servicio completo de gestión de tareas y categorías
 * Abstrae todas las operaciones CRUD contra JSON Server
 */

import api from './api';
import { ENDPOINTS } from '../utils/constants';

/* ─────────────────────────────────────────
   TAREAS
───────────────────────────────────────── */

/**
 * Obtiene todas las tareas ordenadas por fecha de creación (más recientes primero)
 * @returns {Promise<Array>}
 */
export const fetchTasks = async () => {
  const response = await api.get(ENDPOINTS.TASKS);
  // Sort client-side: more recent first (handles tasks without createdAt)
  const tasks = response.data;
  return tasks.sort((a, b) => {
    const dateA = a.createdAt || a.updatedAt || '0';
    const dateB = b.createdAt || b.updatedAt || '0';
    return dateB.localeCompare(dateA);
  });
};

/**
 * Crea una nueva tarea en la API
 * @param {Object} taskData - Datos de la tarea
 * @returns {Promise<Object>} Tarea creada con ID asignado
 */
export const createTask = async (taskData) => {
  const newTask = {
    ...taskData,
    estado: 'pendiente',
    createdAt: new Date().toISOString(),
  };
  const response = await api.post(ENDPOINTS.TASKS, newTask);
  return response.data;
};

/**
 * Actualiza una tarea existente
 * @param {string|number} id - ID de la tarea
 * @param {Object} updatedData - Campos a actualizar
 * @returns {Promise<Object>} Tarea actualizada
 */
export const updateTask = async (id, updatedData) => {
  const response = await api.put(`${ENDPOINTS.TASKS}/${id}`, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
  return response.data;
};

/**
 * Cambia el estado de una tarea (toggle completada/pendiente)
 * @param {Object} task - Tarea actual
 * @returns {Promise<Object>} Tarea con estado actualizado
 */
export const toggleTaskStatus = async (task) => {
  const newStatus = task.estado === 'completada' ? 'pendiente' : 'completada';
  return updateTask(task.id, { ...task, estado: newStatus });
};

/**
 * Elimina una tarea por ID
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const deleteTask = async (id) => {
  await api.delete(`${ENDPOINTS.TASKS}/${id}`);
};

/* ─────────────────────────────────────────
   CATEGORÍAS
───────────────────────────────────────── */

/**
 * Obtiene todas las categorías disponibles
 * @returns {Promise<Array>}
 */
export const fetchCategories = async () => {
  const response = await api.get(ENDPOINTS.CATEGORIES);
  return response.data;
};

/**
 * Crea una nueva categoría personalizada
 * @param {Object} categoryData - { name, color }
 * @returns {Promise<Object>} Categoría creada
 */
export const createCategory = async (categoryData) => {
  const response = await api.post(ENDPOINTS.CATEGORIES, {
    ...categoryData,
    createdAt: new Date().toISOString(),
  });
  return response.data;
};

/**
 * Elimina una categoría (no borra las tareas asociadas)
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  await api.delete(`${ENDPOINTS.CATEGORIES}/${id}`);
};
