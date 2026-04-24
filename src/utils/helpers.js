/**
 * @file helpers.js
 * @description Funciones utilitarias reutilizables para ToDo List Pro
 */

/**
 * Formatea una fecha ISO a formato legible en español
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha para inputs tipo date (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Calcula los días restantes hasta una fecha
 * @returns {number|null}
 */
export const getDaysRemaining = (dateString) => {
  if (!dateString) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString + 'T00:00:00');
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Normaliza el estado de una tarea (maneja tareas sin campo estado)
 */
export const getTaskStatus = (task) => task.estado || 'pendiente';

/**
 * Determina si una tarea está vencida
 */
export const isTaskOverdue = (task) => {
  if (getTaskStatus(task) === 'completada') return false;
  const daysRemaining = getDaysRemaining(task.fechaFin);
  return daysRemaining !== null && daysRemaining < 0;
};

/**
 * Determina si una tarea está próxima a vencer
 */
export const isTaskUpcoming = (task) => {
  if (getTaskStatus(task) === 'completada') return false;
  const daysRemaining = getDaysRemaining(task.fechaFin);
  const alertDays = task.alertaDias || 3;
  return daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= alertDays;
};

/**
 * Genera un ID único
 */
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

/**
 * Trunca texto
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
};

/**
 * Valida el formato de email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida que una fecha fin sea posterior a la fecha inicio
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(endDate) >= new Date(startDate);
};

/**
 * Calcula estadísticas de tareas
 */
export const calculateTaskStats = (tasks) => {
  const pending   = tasks.filter((t) => getTaskStatus(t) === 'pendiente').length;
  const completed = tasks.filter((t) => getTaskStatus(t) === 'completada').length;
  const overdue   = tasks.filter((t) => isTaskOverdue(t)).length;
  const upcoming  = tasks.filter((t) => isTaskUpcoming(t) && !isTaskOverdue(t)).length;
  return { pending, completed, overdue, upcoming, total: tasks.length };
};

/**
 * Filtra tareas según criterios.
 * @param {Object} filters - { search, category, status, special }
 *   special: '' | 'overdue' | 'upcoming'  (filtros desde stats cards)
 *   status:  '' | 'pendiente' | 'completada'
 */
export const filterTasks = (tasks, { search = '', category = '', status = '', special = '' }) => {
  return tasks.filter((task) => {
    /* Búsqueda de texto */
    const matchesSearch =
      !search ||
      task.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      task.descripcion?.toLowerCase().includes(search.toLowerCase());

    /* Categoría — 'all' o vacío = todas */
    const matchesCategory =
      !category || category === 'all' || task.categoria === category;

    /* Estado / filtro especial (desde stats cards) */
    let matchesStatus = true;
    if (special === 'overdue') {
      matchesStatus = isTaskOverdue(task);
    } else if (special === 'upcoming') {
      matchesStatus = isTaskUpcoming(task) && !isTaskOverdue(task);
    } else if (status) {
      matchesStatus = getTaskStatus(task) === status;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });
};

/**
 * Obtiene el color de estado de una tarea
 */
export const getTaskStatusColor = (task) => {
  if (getTaskStatus(task) === 'completada') return '#00e676';
  if (isTaskOverdue(task))   return '#ff5252';
  if (isTaskUpcoming(task))  return '#ffd740';
  return '#40c4ff';
};

/**
 * Obtiene la etiqueta de días restantes
 */
export const getDaysLabel = (task) => {
  if (getTaskStatus(task) === 'completada') return 'Completada';
  const days = getDaysRemaining(task.fechaFin);
  if (days === null)  return 'Sin fecha';
  if (days < 0)       return `Venció hace ${Math.abs(days)}d`;
  if (days === 0)     return 'Vence hoy';
  if (days === 1)     return 'Mañana';
  return `${days} días restantes`;
};

/**
 * Calcula el progreso de subtareas (0–100)
 */
export const getSubtaskProgress = (subtasks = []) => {
  if (!subtasks.length) return 0;
  const done = subtasks.filter((s) => s.completed).length;
  return Math.round((done / subtasks.length) * 100);
};

/**
 * Ícono emoji por categoría
 */
export const getCategoryIcon = (name = '') => {
  const icons = {
    trabajo: '💼', universidad: '🎓', casa: '🏠', compras: '🛒',
    personal: '👤', salud: '🏥', finanzas: '💰', deporte: '🏃',
  };
  return icons[name.toLowerCase()] || '📁';
};
