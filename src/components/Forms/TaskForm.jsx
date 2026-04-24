/**
 * @file TaskForm.jsx
 * @description Formulario completo para crear y editar tareas
 * Incluye: validaciones en tiempo real, selector de categoría con color,
 * selector de días de alerta, campo de descripción expandible
 */

import { useTasks } from '../../context/TaskContext';
import useTaskForm from '../../hooks/useTaskForm';
import { ALERT_DAYS_OPTIONS } from '../../utils/constants';
import styles from './TaskForm.module.css';

/**
 * @param {Object|null} taskToEdit - Tarea a editar (null = nueva tarea)
 * @param {Function} onSuccess - Callback al completar con éxito
 * @param {Function} onCancel - Callback al cancelar
 */
const TaskForm = ({ taskToEdit = null, onSuccess, onCancel }) => {
  const { addTask, editTask, categories, addCategory, loading } = useTasks();
  const { formData, errors, handleInputChange, handleChange, validate, resetForm } =
    useTaskForm(taskToEdit);

  const isEditing = !!taskToEdit;

  /** Maneja el envío del formulario */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Agrega el color de la categoría al guardar
    const selectedCat = categories.find((c) => c.name === formData.categoria);
    const taskData = {
      ...formData,
      categoriaColor: selectedCat?.color || '#00e676',
      alertaDias: Number(formData.alertaDias),
    };

    let success;
    if (isEditing) {
      success = await editTask(taskToEdit.id, taskData);
    } else {
      success = await addTask(taskData);
    }

    if (success) {
      if (!isEditing) resetForm();
      onSuccess?.();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Título */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="titulo">
          Título <span className={styles.required}>*</span>
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          className={`${styles.input} ${errors.titulo ? styles.inputError : ''}`}
          placeholder="¿Qué necesitas hacer?"
          value={formData.titulo}
          onChange={handleInputChange}
          autoFocus={!isEditing}
          maxLength={100}
        />
        {errors.titulo && <span className={styles.errorMsg}>{errors.titulo}</span>}
      </div>

      {/* Descripción */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="descripcion">
          Descripción <span className={styles.optional}>(opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          className={styles.textarea}
          placeholder="Agrega detalles adicionales sobre esta tarea..."
          value={formData.descripcion}
          onChange={handleInputChange}
          rows={3}
          maxLength={500}
        />
        <span className={styles.charCount}>{formData.descripcion.length}/500</span>
      </div>

      {/* Categoría */}
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="categoria">
          Categoría <span className={styles.required}>*</span>
        </label>
        <div className={styles.categoryGrid}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.catBtn} ${formData.categoria === cat.name ? styles.catBtnActive : ''}`}
              style={{ '--cat-c': cat.color }}
              onClick={() => handleChange('categoria', cat.name)}
            >
              <span className={styles.catDot} style={{ background: cat.color }} />
              {cat.name}
            </button>
          ))}
          <button
            type="button"
            className={styles.catBtnNew}
            onClick={() => {
              const name = prompt('Nombre de la nueva categoría:');
              if (name?.trim()) {
                const colors = ['#ffab40', '#69f0ae', '#ea80fc', '#18ffff'];
                addCategory({
                  name: name.trim(),
                  color: colors[Math.floor(Math.random() * colors.length)],
                });
              }
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Nueva
          </button>
        </div>
        {errors.categoria && <span className={styles.errorMsg}>{errors.categoria}</span>}
      </div>

      {/* Fechas */}
      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="fechaInicio">
            Fecha inicio
          </label>
          <input
            id="fechaInicio"
            name="fechaInicio"
            type="date"
            className={styles.input}
            value={formData.fechaInicio}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label} htmlFor="fechaFin">
            Fecha vencimiento <span className={styles.required}>*</span>
          </label>
          <input
            id="fechaFin"
            name="fechaFin"
            type="date"
            className={`${styles.input} ${errors.fechaFin ? styles.inputError : ''}`}
            value={formData.fechaFin}
            onChange={handleInputChange}
          />
          {errors.fechaFin && <span className={styles.errorMsg}>{errors.fechaFin}</span>}
        </div>
      </div>

      {/* Días de alerta */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>
          Alerta previa <span className={styles.optional}>(días antes del vencimiento)</span>
        </label>
        <div className={styles.alertDaysGrid}>
          {ALERT_DAYS_OPTIONS.map((days) => (
            <button
              key={days}
              type="button"
              className={`${styles.alertBtn} ${Number(formData.alertaDias) === days ? styles.alertBtnActive : ''}`}
              onClick={() => handleChange('alertaDias', days)}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.btnLoading}>
              <span className={styles.btnSpinner} />
              {isEditing ? 'Guardando...' : 'Creando...'}
            </span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                {isEditing ? (
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <>
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </>
                )}
              </svg>
              {isEditing ? 'Guardar cambios' : 'Crear tarea'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
