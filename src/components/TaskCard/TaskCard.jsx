/**
 * @file TaskCard.jsx
 * @description Tarjeta de tarea expandible con soporte de subtareas.
 *
 * Colapsada : título, badge categoría, estado, fechas
 * Expandida : descripción completa, subtareas interactivas, acciones
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import {
  formatDate, getDaysLabel, getTaskStatusColor,
  isTaskOverdue, isTaskUpcoming, getTaskStatus,
  getSubtaskProgress, generateId,
} from '../../utils/helpers';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onEdit }) => {
  const { removeTask, toggleTask, addSubtask, toggleSubtask, removeSubtask } = useTasks();

  const [expanded,     setExpanded]     = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [isDeleting,   setIsDeleting]   = useState(false);
  const [isToggling,   setIsToggling]   = useState(false);
  const [newSub,       setNewSub]       = useState('');
  const [addingSubtask,setAddingSubtask]= useState(false);

  const statusColor = getTaskStatusColor(task);
  const overdue     = isTaskOverdue(task);
  const upcoming    = isTaskUpcoming(task);
  const isCompleted = getTaskStatus(task) === 'completada';
  const subtasks    = task.subtasks || [];
  const progress    = getSubtaskProgress(subtasks);

  /* ── Acciones ── */
  const handleDelete = async () => {
    setIsDeleting(true);
    await removeTask(task.id);
    setIsDeleting(false);
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    setIsToggling(true);
    await toggleTask(task);
    setIsToggling(false);
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSub.trim()) return;
    setAddingSubtask(true);
    await addSubtask(task.id, newSub.trim());
    setNewSub('');
    setAddingSubtask(false);
  };

  return (
    <motion.div
      className={`${styles.card}
        ${isCompleted ? styles.completed : ''}
        ${overdue     ? styles.overdue   : ''}
        ${upcoming && !overdue ? styles.upcoming : ''}
        ${expanded    ? styles.expanded  : ''}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* ── Barra lateral de color ── */}
      <div className={styles.statusBar} style={{ background: statusColor }} />

      <div className={styles.body}>

        {/* ══════════════════════════════
            CABECERA (siempre visible)
        ══════════════════════════════ */}
        <div
          className={styles.header}
          onClick={() => setExpanded(!expanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
        >
          {/* Chevron de expansión */}
          <motion.span
            className={styles.chevron}
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.span>

          {/* Checkbox de estado */}
          <button
            className={`${styles.checkbox} ${isCompleted ? styles.checkboxDone : ''}`}
            onClick={handleToggle}
            disabled={isToggling}
            aria-label={isCompleted ? 'Marcar pendiente' : 'Marcar completada'}
          >
            {isCompleted && (
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>

          {/* Título + badges */}
          <div className={styles.titleGroup}>
            <span className={`${styles.title} ${isCompleted ? styles.titleDone : ''}`}>
              {task.titulo}
            </span>

            {task.categoria && (
              <span
                className={styles.catBadge}
                style={{ '--bc': task.categoriaColor || '#00e676' }}
              >
                {task.categoria}
              </span>
            )}
          </div>

          {/* Estado badge (derecha) */}
          <span
            className={styles.statusBadge}
            style={{ color: statusColor, borderColor: statusColor + '40', background: statusColor + '12' }}
          >
            {overdue && !isCompleted ? '⚠ Vencida'
              : isCompleted          ? '✓ Lista'
              : upcoming             ? '⏰ Próxima'
              :                        '◦ Activa'}
          </span>
        </div>

        {/* ── Fila de fechas (siempre visible) ── */}
        <div className={styles.dateRow} onClick={() => setExpanded(!expanded)}>
          <svg viewBox="0 0 24 24" fill="none" className={styles.dateIcon}>
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="8"  y1="2" x2="8"  y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="3"  y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span>{formatDate(task.fechaInicio)}</span>
          <span className={styles.arrow}>→</span>
          <span style={{ color: overdue && !isCompleted ? 'var(--color-overdue)' : 'inherit' }}>
            {formatDate(task.fechaFin)}
          </span>
          <span className={styles.daysLabel} style={{ color: statusColor }}>
            {getDaysLabel(task)}
          </span>
          {task.alertaDias && (
            <span className={styles.alertBadge}>🔔 Alerta {task.alertaDias}d</span>
          )}
        </div>

        {/* ── Progreso de subtareas (siempre visible) ── */}
        {subtasks.length > 0 && (
          <div className={styles.progressRow} onClick={() => setExpanded(!expanded)}>
            <span className={styles.progressLabel}>SUBTAREAS</span>
            <span className={styles.subtaskCount}>
              {subtasks.filter(s => s.completed).length}/{subtasks.length}
            </span>
            <div className={styles.subProgress}>
              <div className={styles.subProgressBar} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.progressPct}>{progress}%</span>
          </div>
        )}

        {/* ══════════════════════════════
            ÁREA EXPANDIDA
        ══════════════════════════════ */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              className={styles.expandedArea}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{   opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
            >
              <div className={styles.expandedInner}>

                {/* Descripción */}
                {task.descripcion && (
                  <p className={styles.description}>{task.descripcion}</p>
                )}

                {/* ── Subtareas ── */}
                <div className={styles.subtaskSection}>

                  {/* Lista de subtareas */}
                  <div className={styles.subtaskList}>
                    <AnimatePresence>
                      {subtasks.map((sub) => (
                        <motion.div
                          key={sub.id}
                          className={styles.subtaskItem}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{   opacity: 0, x: -8, height: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <button
                            className={`${styles.subCheck} ${sub.completed ? styles.subCheckDone : ''}`}
                            onClick={() => toggleSubtask(task.id, sub.id)}
                          >
                            {sub.completed && (
                              <svg viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </button>
                          <span className={`${styles.subLabel} ${sub.completed ? styles.subLabelDone : ''}`}>
                            {sub.title}
                          </span>
                          <button
                            className={styles.subDelete}
                            onClick={() => removeSubtask(task.id, sub.id)}
                            title="Eliminar subtarea"
                          >
                            <svg viewBox="0 0 24 24" fill="none">
                              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              <line x1="6"  y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Input para nueva subtarea */}
                    <form onSubmit={handleAddSubtask} className={styles.addSubForm}>
                      <input
                        className={styles.addSubInput}
                        type="text"
                        placeholder="+ Agregar subtarea..."
                        value={newSub}
                        onChange={(e) => setNewSub(e.target.value)}
                        maxLength={100}
                      />
                      {newSub.trim() && (
                        <button
                          type="submit"
                          className={styles.addSubBtn}
                          disabled={addingSubtask}
                        >
                          {addingSubtask ? '...' : '↵'}
                        </button>
                      )}
                    </form>
                  </div>
                </div>

                {/* ── Acciones (editar / eliminar) ── */}
                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Editar
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Confirmación de eliminación ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className={styles.confirmOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.confirmBox}>
              <span className={styles.confirmEmoji}>🗑️</span>
              <p className={styles.confirmText}>¿Eliminar esta tarea?</p>
              {subtasks.length > 0 && (
                <p className={styles.confirmWarn}>
                  Se eliminarán {subtasks.length} subtarea{subtasks.length !== 1 ? 's' : ''}.
                </p>
              )}
              <div className={styles.confirmActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setShowConfirm(false)}
                  disabled={isDeleting}
                >Cancelar</button>
                <button
                  className={styles.confirmDeleteBtn}
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;
