/**
 * @file Modal.jsx
 * @description Componente Modal genérico y reutilizable
 * Centrado con flexbox para evitar conflicto con animaciones de Framer Motion
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Modal.module.css';

/**
 * @param {boolean} isOpen     - Controla si el modal está visible
 * @param {Function} onClose   - Callback para cerrar el modal
 * @param {string} title       - Título del modal
 * @param {ReactNode} children - Contenido del modal
 * @param {string} size        - Tamaño: 'sm' | 'md' | 'lg'
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  /* ── Cierra con ESC ── */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  /* ── Bloquea scroll del body ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/*
            Wrapper de centrado — usa flexbox para posicionar el modal.
            NO usamos transform: translate(-50%,-50%) porque Framer Motion
            sobreescribe la propiedad transform con sus animaciones (y, scale),
            rompiendo el centrado. Flexbox resuelve el centrado de forma
            independiente a las transformaciones de animación.
          */}
          <div className={styles.wrapper} onClick={onClose}>
            <motion.div
              className={`${styles.modal} ${styles[size]}`}
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              /* Evita que el click dentro del modal cierre el overlay */
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={styles.header}>
                <h2 id="modal-title" className={styles.title}>{title}</h2>
                <button
                  className={styles.closeBtn}
                  onClick={onClose}
                  aria-label="Cerrar modal"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6"  x2="6"  y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="6"  y1="6"  x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Contenido */}
              <div className={styles.content}>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
