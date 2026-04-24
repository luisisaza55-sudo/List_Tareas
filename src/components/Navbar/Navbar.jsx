/**
 * @file Navbar.jsx
 * @description Barra de navegación superior responsive con menú móvil
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { stats } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo y marca */}
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <span className={styles.brandName}>ToDo List</span>
            <span className={styles.brandTag}>Pro</span>
          </div>
        </div>

        {/* Stats rápidas en centro (solo desktop) */}
        <div className={styles.quickStats}>
          <div className={styles.statBadge} data-type="pending">
            <span className={styles.statNum}>{stats.pending}</span>
            <span className={styles.statLabel}>Pendientes</span>
          </div>
          <div className={styles.statBadge} data-type="completed">
            <span className={styles.statNum}>{stats.completed}</span>
            <span className={styles.statLabel}>Completadas</span>
          </div>
          <div className={styles.statBadge} data-type="overdue">
            <span className={styles.statNum}>{stats.overdue}</span>
            <span className={styles.statLabel}>Vencidas</span>
          </div>
        </div>

        {/* Acciones de usuario */}
        <div className={styles.actions}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.name}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Salir</span>
          </button>

          {/* Menú hamburguesa (móvil) */}
          <button
            className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.mobileUser}>
              <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <p className={styles.userName}>{user?.name}</p>
                <p className={styles.userEmail}>{user?.email}</p>
              </div>
            </div>
            <div className={styles.mobileStats}>
              <div className={styles.statBadge} data-type="pending">
                <span className={styles.statNum}>{stats.pending}</span>
                <span className={styles.statLabel}>Pendientes</span>
              </div>
              <div className={styles.statBadge} data-type="completed">
                <span className={styles.statNum}>{stats.completed}</span>
                <span className={styles.statLabel}>Completadas</span>
              </div>
              <div className={styles.statBadge} data-type="overdue">
                <span className={styles.statNum}>{stats.overdue}</span>
                <span className={styles.statLabel}>Vencidas</span>
              </div>
            </div>
            <button className={styles.mobileLogout} onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Cerrar Sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
