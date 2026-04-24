/**
 * @file NotFound.jsx
 * @description Página 404 - Ruta no encontrada
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.page}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.text}>
          La ruta que buscas no existe o fue movida.
        </p>
        <Link to="/dashboard" className={styles.backBtn}>
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Ir al Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
