/**
 * @file TaskContext.jsx
 * @description Contexto global de gestión de tareas, categorías, filtros y subtareas
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  fetchTasks, createTask, updateTask, deleteTask, toggleTaskStatus,
  fetchCategories, createCategory,
} from '../services/taskService';
import { calculateTaskStats, filterTasks, generateId } from '../utils/helpers';
import { DEFAULT_CATEGORIES, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  /* ── Estado principal ── */
  const [tasks,      setTasks]      = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading,    setLoading]    = useState(false);
  const [taskError,  setTaskError]  = useState(null);

  /* ── Filtros ──
     search    : texto libre
     category  : nombre de categoría ('all' = todas)
     status    : 'pendiente' | 'completada' | ''
     special   : 'overdue' | 'upcoming' | ''   ← desde stats cards
  */
  const [filters, setFilters] = useState({
    search: '', category: '', status: '', special: '',
  });

  /* ─────────────────────────────────────────
     CARGA INICIAL
  ───────────────────────────────────────── */
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setTaskError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      const msg = error.message || ERROR_MESSAGES.LOAD_ERROR;
      setTaskError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      if (data.length > 0) setCategories(data);
    } catch {
      setCategories(DEFAULT_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
      loadCategories();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, loadTasks, loadCategories]);

  /* ─────────────────────────────────────────
     CRUD TAREAS
  ───────────────────────────────────────── */
  const addTask = useCallback(async (taskData) => {
    setLoading(true);
    try {
      const newTask = await createTask({ ...taskData, subtasks: taskData.subtasks || [] });
      setTasks((prev) => [newTask, ...prev]);
      toast.success(SUCCESS_MESSAGES.TASK_CREATED);
      return true;
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.CREATE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const editTask = useCallback(async (id, taskData) => {
    setLoading(true);
    try {
      const updated = await updateTask(id, taskData);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      toast.success(SUCCESS_MESSAGES.TASK_UPDATED);
      return true;
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.UPDATE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTask = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success(SUCCESS_MESSAGES.TASK_DELETED);
      return true;
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.DELETE_ERROR);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTask = useCallback(async (task) => {
    try {
      const updated = await toggleTaskStatus(task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      const msg = updated.estado === 'completada'
        ? SUCCESS_MESSAGES.TASK_COMPLETED
        : SUCCESS_MESSAGES.TASK_REOPENED;
      toast.success(msg);
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.UPDATE_ERROR);
    }
  }, []);

  /* ─────────────────────────────────────────
     SUBTAREAS
  ───────────────────────────────────────── */

  /**
   * Agrega una nueva subtarea a una tarea existente
   * @param {string} taskId
   * @param {string} title
   */
  const addSubtask = useCallback(async (taskId, title) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newSubtask = { id: generateId(), title, completed: false };
    const updatedSubtasks = [...(task.subtasks || []), newSubtask];
    try {
      const updated = await updateTask(taskId, { ...task, subtasks: updatedSubtasks });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (error) {
      toast.error('Error al agregar subtarea.');
    }
  }, [tasks]);

  /**
   * Alterna el estado de una subtarea (completada / pendiente)
   * @param {string} taskId
   * @param {string} subtaskId
   */
  const toggleSubtask = useCallback(async (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updatedSubtasks = (task.subtasks || []).map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    try {
      const updated = await updateTask(taskId, { ...task, subtasks: updatedSubtasks });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (error) {
      toast.error('Error al actualizar subtarea.');
    }
  }, [tasks]);

  /**
   * Elimina una subtarea
   * @param {string} taskId
   * @param {string} subtaskId
   */
  const removeSubtask = useCallback(async (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updatedSubtasks = (task.subtasks || []).filter((s) => s.id !== subtaskId);
    try {
      const updated = await updateTask(taskId, { ...task, subtasks: updatedSubtasks });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (error) {
      toast.error('Error al eliminar subtarea.');
    }
  }, [tasks]);

  /* ─────────────────────────────────────────
     CATEGORÍAS
  ───────────────────────────────────────── */
  const addCategory = useCallback(async (categoryData) => {
    try {
      const newCat = await createCategory(categoryData);
      setCategories((prev) => [...prev, newCat]);
      toast.success(SUCCESS_MESSAGES.CATEGORY_CREATED);
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al crear la categoría.');
      return false;
    }
  }, []);

  /* ─────────────────────────────────────────
     FILTROS
  ───────────────────────────────────────── */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Activa un filtro desde un stat card.
   * Si ya está activo el mismo, lo desactiva (toggle).
   * @param {'pending'|'completed'|'overdue'|'upcoming'} type
   */
  const setStatFilter = useCallback((type) => {
    setFilters((prev) => {
      const map = {
        pending:   { status: 'pendiente',  special: '' },
        completed: { status: 'completada', special: '' },
        overdue:   { status: '',           special: 'overdue' },
        upcoming:  { status: '',           special: 'upcoming' },
      };
      const current = map[type];
      // Toggle: si ya está activo, limpia
      const alreadyActive =
        prev.status === current.status && prev.special === current.special &&
        (current.status !== '' || current.special !== '');
      return alreadyActive
        ? { ...prev, status: '', special: '' }
        : { ...prev, ...current };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', category: '', status: '', special: '' });
  }, []);

  /* ─────────────────────────────────────────
     DATOS DERIVADOS
  ───────────────────────────────────────── */
  const filteredTasks = filterTasks(tasks, filters);
  const stats         = calculateTaskStats(tasks);

  /** Tareas por categoría (para mostrar contadores en las tarjetas de categoría) */
  const tasksByCategory = categories.reduce((acc, cat) => {
    acc[cat.name] = tasks.filter((t) => t.categoria === cat.name).length;
    return acc;
  }, {});

  /** Estado activo del filtro de stats card */
  const activeStatFilter =
    filters.special === 'overdue'  ? 'overdue'   :
    filters.special === 'upcoming' ? 'upcoming'  :
    filters.status  === 'pendiente'? 'pending'   :
    filters.status  === 'completada'? 'completed' : null;

  const value = {
    tasks, filteredTasks, categories, loading, taskError,
    filters, stats, tasksByCategory, activeStatFilter,
    addTask, editTask, removeTask, toggleTask, loadTasks,
    addSubtask, toggleSubtask, removeSubtask,
    addCategory,
    updateFilters, setStatFilter, clearFilters,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks debe usarse dentro de <TaskProvider>');
  return context;
};

export default TaskContext;
