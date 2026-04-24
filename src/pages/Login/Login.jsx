/**
 * @file Login.jsx
 * @description Página de autenticación con diseño premium
 * Valida credenciales contra JSON Server y guarda sesión
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/helpers';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, authError, isAuthenticated, clearAuthError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Si ya está autenticado, redirige al dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Limpia errores de API al escribir
  useEffect(() => {
    if (authError) clearAuthError();
  }, [email, password]); // eslint-disable-line

  /** Valida campos locales antes de llamar a la API */
  const validateFields = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'El correo es requerido.';
    } else if (!isValidEmail(email)) {
      errs.email = 'Ingresa un correo válido.';
    }
    if (!password) {
      errs.password = 'La contraseña es requerida.';
    } else if (password.length < 4) {
      errs.password = 'La contraseña debe tener al menos 4 caracteres.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    await login(email, password);
  };

  const handleDemoLogin = async () => {
    setEmail('admin@admin.com');
    setPassword('123456');
    setFieldErrors({});
    await login('admin@admin.com', '123456');
  };

  return (
    <div className={styles.page}>
      {/* Fondo animado con partículas */}
      <div className={styles.bgPattern}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.bgOrb} style={{ '--i': i }} />
        ))}
      </div>

      <div className={styles.container}>
        {/* Panel izquierdo - Branding */}
        <motion.div
          className={styles.brandPanel}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className={styles.brandContent}>
            <div className={styles.brandLogo}>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className={styles.brandTitle}>
              ToDo List <span>Pro</span>
            </h1>
            <p className={styles.brandSubtitle}>
              Sistema avanzado de gestión de tareas. Organiza, prioriza y completa tus objetivos.
            </p>

            <div className={styles.features}>
              {[
                { icon: '⚡', text: 'Gestión inteligente de tareas' },
                { icon: '📊', text: 'Estadísticas en tiempo real' },
                { icon: '🔔', text: 'Alertas de vencimiento' },
                { icon: '📁', text: 'Categorías personalizables' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.featureItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <span>{f.text}</span>
                </motion.div>
              ))}
            </div>

            <div className={styles.demoCredentials}>
              <p className={styles.demoTitle}>Credenciales de prueba:</p>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Email:</span>
                <code>admin@admin.com</code>
              </div>
              <div className={styles.credentialRow}>
                <span className={styles.credLabel}>Password:</span>
                <code>123456</code>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Panel derecho - Formulario */}
        <motion.div
          className={styles.formPanel}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Iniciar Sesión</h2>
              <p className={styles.formSubtitle}>Ingresa tus credenciales para continuar</p>
            </div>

            {/* Error de autenticación */}
            {authError && (
              <motion.div
                className={styles.errorAlert}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {authError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* Email */}
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.fieldLabel}>
                  Correo electrónico
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                    placeholder="admin@admin.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })); }}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
              </div>

              {/* Contraseña */}
              <div className={styles.fieldGroup}>
                <label htmlFor="password" className={styles.fieldLabel}>
                  Contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`${styles.input} ${fieldErrors.password ? styles.inputError : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.showPasswordBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
              </div>

              {/* Botón de login */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.btnContent}>
                    <span className={styles.spinner} />
                    Verificando...
                  </span>
                ) : (
                  <span className={styles.btnContent}>
                    <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Ingresar al sistema
                  </span>
                )}
              </button>

              {/* Botón demo */}
              <button
                type="button"
                className={styles.demoBtn}
                onClick={handleDemoLogin}
                disabled={loading}
              >
                ⚡ Acceso rápido (Demo)
              </button>
            </form>

            <p className={styles.footer}>
              UniMinuto · Ingeniería Web II · {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
