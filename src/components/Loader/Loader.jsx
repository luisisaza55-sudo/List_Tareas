/**
 * @file Loader.jsx
 * @description Componente de carga con animación elegante
 */

import styles from './Loader.module.css';

/**
 * @param {boolean} fullScreen - Si ocupa toda la pantalla
 * @param {string} message - Mensaje opcional debajo del spinner
 */
const Loader = ({ fullScreen = false, message = 'Cargando...' }) => {
  return (
    <div className={`${styles.wrapper} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.spinner}>
        <div className={styles.ring}></div>
        <div className={styles.ring}></div>
        <div className={styles.dot}></div>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Loader;
