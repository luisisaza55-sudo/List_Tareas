/**
 * @file CategoryGrid.jsx
 * @description Grid de tarjetas de categoría (panel izquierdo del Dashboard)
 * Características:
 *  - Tarjeta "Todas las tareas" fija al final
 *  - Tarjeta "+ Agregar" para nuevas categorías
 *  - Color de glow/acento según el color de la categoría
 *  - Contadores de tareas por categoría
 *  - Estado activo con resaltado en el color de la categoría
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import { getCategoryIcon, calculateTaskStats, filterTasks } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../utils/constants';
import styles from './CategoryGrid.module.css';

/* Variantes de animación para cada tarjeta */
const cardVariants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.06, duration: 0.25, ease: 'easeOut' },
  }),
};

const CategoryGrid = () => {
  const { categories, tasks, tasksByCategory, filters, updateFilters, clearFilters, addCategory } = useTasks();

  const [showAddForm, setShowAddForm]   = useState(false);
  const [newCatName,  setNewCatName]    = useState('');
  const [newCatColor, setNewCatColor]   = useState(CATEGORY_COLORS[0]);
  const [addLoading,  setAddLoading]    = useState(false);

  /** Categoría actualmente seleccionada en el filtro */
  const activeCat = filters.category;

  /** Selecciona una categoría (o deselecciona si ya estaba activa) */
  const handleSelect = (catName) => {
    if (activeCat === catName) {
      updateFilters({ category: '' }); // deselecciona
    } else {
      updateFilters({ category: catName, status: '', special: '' });
    }
  };

  /** Selecciona "Todas" */
  const handleSelectAll = () => {
    updateFilters({ category: '', status: '', special: '' });
  };

  /** Crea una nueva categoría */
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddLoading(true);
    await addCategory({ name: newCatName.trim(), color: newCatColor });
    setNewCatName('');
    setNewCatColor(CATEGORY_COLORS[0]);
    setShowAddForm(false);
    setAddLoading(false);
  };

  const isAllActive = !activeCat;
  const allCount    = tasks.length;

  return (
    <div className={styles.wrapper}>
      <p className={styles.sectionLabel}>Mis Listas</p>

      <div className={styles.grid}>
        {/* ── Tarjetas de categoría ── */}
        {categories.map((cat, i) => {
          const isActive = activeCat === cat.name;
          const count    = tasksByCategory[cat.name] || 0;
          /* Stats de las tareas de ESTA categoría */
          const catStats = calculateTaskStats(
            tasks.filter((t) => t.categoria === cat.name)
          );

          return (
            <motion.button
              key={cat.id}
              className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
              style={{
                '--cat-color': cat.color,
                '--cat-glow':  cat.color + '30',
              }}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              onClick={() => handleSelect(cat.name)}
              title={cat.name}
            >
              {/* Barra superior coloreada */}
              <div className={styles.colorBar} />

              {/* Ícono */}
              <span className={styles.icon}>{getCategoryIcon(cat.name)}</span>

              {/* Nombre */}
              <span className={styles.name}>{cat.name}</span>

              {/* Contador total */}
              <span className={styles.count}>{count}</span>

              {/* Mini stats: pendientes / completadas */}
              <div className={styles.miniStats}>
                <span className={styles.miniPending}  title="Pendientes">{catStats.pending}⏳</span>
                <span className={styles.miniDone}     title="Completadas">{catStats.completed}✓</span>
              </div>
            </motion.button>
          );
        })}

        {/* ── Tarjeta Agregar categoría ── */}
        <motion.button
          className={`${styles.card} ${styles.addCard}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={categories.length}
          onClick={() => setShowAddForm(true)}
          title="Agregar categoría"
        >
          <div className={styles.addIcon}>
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={styles.addLabel}>Agregar</span>
        </motion.button>

        {/* ── Tarjeta Todas las tareas ── */}
        <motion.button
          className={`${styles.card} ${styles.allCard} ${isAllActive ? styles.allCardActive : ''}`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={categories.length + 1}
          onClick={handleSelectAll}
          title="Ver todas las tareas"
        >
          <div className={styles.colorBar} />
          <span className={styles.icon}>📋</span>
          <span className={styles.name}>Todas</span>
          <span className={styles.count}>{allCount}</span>
          <div className={styles.miniStats}>
            <span className={styles.miniPending}>{calculateTaskStats(tasks).pending}⏳</span>
            <span className={styles.miniDone}>{calculateTaskStats(tasks).completed}✓</span>
          </div>
        </motion.button>
      </div>

      {/* ── Modal inline para nueva categoría ── */}
      {showAddForm && (
        <motion.div
          className={styles.addForm}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className={styles.addFormTitle}>Nueva categoría</p>
          <form onSubmit={handleAddCategory}>
            <input
              className={styles.addInput}
              type="text"
              placeholder="Nombre (ej. Salud)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              autoFocus
              maxLength={20}
            />
            {/* Selector de color */}
            <div className={styles.colorPicker}>
              {CATEGORY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.colorDot} ${newCatColor === c ? styles.colorDotActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setNewCatColor(c)}
                />
              ))}
            </div>
            <div className={styles.addFormActions}>
              <button
                type="button"
                className={styles.addFormCancel}
                onClick={() => setShowAddForm(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.addFormSubmit}
                disabled={addLoading || !newCatName.trim()}
              >
                {addLoading ? '...' : 'Crear'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default CategoryGrid;
