/**
 * @file StatsCards.jsx
 * @description Tarjetas de estadísticas CLICKEABLES que actúan como filtros
 * Al hacer clic se activa el filtro correspondiente (toggle).
 * El icono y borde se resaltan en el color propio de la tarjeta cuando está activo.
 */

import { motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import styles from './StatsCards.module.css';

const STAT_CARDS = [
  {
    key:         'pending',
    filterKey:   'pending',
    label:       'Pendientes',
    description: 'tareas por hacer',
    color:       '#ffd740',
    bgColor:     'rgba(255,215,64,0.08)',
    borderColor: 'rgba(255,215,64,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key:         'completed',
    filterKey:   'completed',
    label:       'Completadas',
    description: 'tareas finalizadas',
    color:       '#00e676',
    bgColor:     'rgba(0,230,118,0.08)',
    borderColor: 'rgba(0,230,118,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 4L12 14.01l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key:         'overdue',
    filterKey:   'overdue',
    label:       'Vencidas',
    description: 'requieren atención',
    color:       '#ff5252',
    bgColor:     'rgba(255,82,82,0.08)',
    borderColor: 'rgba(255,82,82,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key:         'upcoming',
    filterKey:   'upcoming',
    label:       'Próximas',
    description: 'a punto de vencer',
    color:       '#40c4ff',
    bgColor:     'rgba(64,196,255,0.08)',
    borderColor: 'rgba(64,196,255,0.25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="8"  y1="2" x2="8"  y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3"  y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: 'easeOut' },
  }),
};

const StatsCards = () => {
  const { stats, activeStatFilter, setStatFilter } = useTasks();

  return (
    <div className={styles.grid}>
      {STAT_CARDS.map((card, index) => {
        const isActive = activeStatFilter === card.filterKey;

        return (
          <motion.button
            key={card.key}
            className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
            style={{
              '--card-color':  card.color,
              '--card-bg':     isActive ? card.bgColor.replace('0.08', '0.18') : card.bgColor,
              '--card-border': isActive ? card.color : card.borderColor,
            }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStatFilter(card.filterKey)}
            title={isActive ? `Quitar filtro: ${card.label}` : `Filtrar por: ${card.label}`}
          >
            {/* Icono — resaltado en modo activo con glow del color */}
            <div className={`${styles.iconWrap} ${isActive ? styles.iconActive : ''}`}>
              {card.icon}
            </div>

            {/* Número grande */}
            <div className={styles.value}>{stats[card.key]}</div>

            <div className={styles.info}>
              <p className={styles.label}>{card.label}</p>
              <p className={styles.description}>{card.description}</p>
            </div>

            {/* Barra de progreso */}
            {stats.total > 0 && (
              <div className={styles.progress}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${Math.min((stats[card.key] / stats.total) * 100, 100)}%` }}
                />
              </div>
            )}

            {/* Indicador "activo" */}
            {isActive && (
              <div className={styles.activeIndicator}>
                <svg viewBox="0 0 24 24" fill="none" width="10" height="10">
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Filtro activo
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default StatsCards;
