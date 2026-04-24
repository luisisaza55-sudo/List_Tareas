/**
 * @file Dashboard.jsx
 * @description Panel principal con layout de dos columnas:
 *  - Izquierda : Grid de categorías (sidebar)
 *  - Derecha   : Lista de tareas con stats clickeables + filtros
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import Navbar      from '../../components/Navbar/Navbar';
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid';
import StatsCards  from '../../components/StatsCards/StatsCards';
import TaskCard    from '../../components/TaskCard/TaskCard';
import Modal       from '../../components/Modal/Modal';
import TaskForm    from '../../components/Forms/TaskForm';
import Loader      from '../../components/Loader/Loader';
import styles      from './Dashboard.module.css';

const Dashboard = () => {
  const {
    filteredTasks, loading, taskError,
    filters, updateFilters, clearFilters,
    stats, activeStatFilter,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit,  setTaskToEdit]  = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // móvil

  const handleNewTask  = () => { setTaskToEdit(null); setIsModalOpen(true); };
  const handleEditTask = (task) => { setTaskToEdit(task); setIsModalOpen(true); };
  const handleClose    = () => { setIsModalOpen(false); setTaskToEdit(null); };

  const hasFilters = filters.search || filters.category || filters.status || filters.special;

  /* Título del panel derecho según categoría activa */
  const panelTitle = filters.category
    ? filters.category
    : activeStatFilter
      ? { pending:'Pendientes', completed:'Completadas', overdue:'Vencidas', upcoming:'Próximas' }[activeStatFilter]
      : 'Todas las tareas';

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.layout}>

        {/* ════════════════════════════════
            SIDEBAR — Categorías
        ════════════════════════════════ */}

        {/* Overlay móvil */}
        {sidebarOpen && (
          <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarInner}>
            <CategoryGrid />
          </div>
        </aside>

        {/* ════════════════════════════════
            PANEL PRINCIPAL — Tareas
        ════════════════════════════════ */}
        <main className={styles.main}>

          {/* Header del panel */}
          <div className={styles.panelHeader}>
            {/* Botón hamburguesa para abrir sidebar en móvil */}
            <button
              className={styles.sidebarToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Ver categorías"
            >
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                <line x1="3" y1="6"  x2="21" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className={styles.panelTitleWrap}>
              <h1 className={styles.panelTitle}>{panelTitle}</h1>
              <span className={styles.panelCount}>
                {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''}
              </span>
            </div>

            <button className={styles.newTaskBtn} onClick={handleNewTask}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="5"  y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <span>Nueva Tarea</span>
            </button>
          </div>

          {/* Stats cards (4 en PC, 2 en móvil) — clickeables como filtros */}
          <section className={styles.statsSection}>
            <StatsCards />
            {activeStatFilter && (
              <motion.p
                className={styles.filterHint}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Mostrando solo <strong>
                  {{ pending:'pendientes', completed:'completadas', overdue:'vencidas', upcoming:'próximas' }[activeStatFilter]}
                </strong> — <button className={styles.clearHint} onClick={clearFilters}>ver todas</button>
              </motion.p>
            )}
          </section>

          {/* Barra de búsqueda + filtros */}
          <div className={styles.filtersBar}>
            <div className={styles.searchWrap}>
              <svg viewBox="0 0 24 24" fill="none" className={styles.searchIcon}>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Buscar tareas..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
              />
              {filters.search && (
                <button className={styles.clearSearch} onClick={() => updateFilters({ search: '' })}>×</button>
              )}
            </div>

            <select
              className={styles.filterSelect}
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value, special: '' })}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="completada">Completadas</option>
            </select>

            {hasFilters && (
              <button className={styles.clearAllBtn} onClick={clearFilters}>
                <svg viewBox="0 0 24 24" fill="none" width="13" height="13">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="6"  y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Limpiar
              </button>
            )}
          </div>

          {/* ── Lista de tareas ── */}
          <div className={styles.taskList}>

            {loading && filteredTasks.length === 0 && (
              <Loader message="Cargando tareas..." />
            )}

            {taskError && !loading && (
              <div className={styles.errorState}>
                <p className={styles.errorTitle}>⚠️ Error de conexión</p>
                <p>{taskError}</p>
                <p className={styles.errorHint}>Corre: <code>npm run server</code></p>
              </div>
            )}

            {!loading && !taskError && filteredTasks.length === 0 && (
              <motion.div
                className={styles.emptyState}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.emptyIcon}>
                  {hasFilters ? '🔍' : '📋'}
                </div>
                <p className={styles.emptyTitle}>
                  {hasFilters ? 'Sin resultados' : '¡Sin tareas aún!'}
                </p>
                <p className={styles.emptyText}>
                  {hasFilters
                    ? 'Ninguna tarea coincide con los filtros activos.'
                    : 'Crea tu primera tarea para empezar.'}
                </p>
                {hasFilters
                  ? <button className={styles.emptyBtn} onClick={clearFilters}>Limpiar filtros</button>
                  : <button className={styles.emptyBtn} onClick={handleNewTask}>+ Crear tarea</button>
                }
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modal crear / editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={taskToEdit ? '✏️ Editar Tarea' : '➕ Nueva Tarea'}
        size="md"
      >
        <TaskForm
          taskToEdit={taskToEdit}
          onSuccess={handleClose}
          onCancel={handleClose}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
