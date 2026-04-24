/**
 * @file useTaskForm.js
 * @description Hook personalizado para manejo del formulario de tareas
 * Centraliza validaciones, estado del formulario y lógica de envío
 */

import { useState, useCallback } from 'react';
import { isValidDateRange, formatDateForInput } from '../utils/helpers';
import { ERROR_MESSAGES } from '../utils/constants';

/** Estado inicial vacío del formulario */
const INITIAL_FORM_STATE = {
  titulo: '',
  descripcion: '',
  categoria: '',
  fechaInicio: formatDateForInput(new Date()),
  fechaFin: '',
  alertaDias: 3,
};

/**
 * @param {Object|null} initialData - Datos de la tarea a editar (null = nueva tarea)
 * @returns {Object} Estado y funciones del formulario
 */
const useTaskForm = (initialData = null) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        titulo: initialData.titulo || '',
        descripcion: initialData.descripcion || '',
        categoria: initialData.categoria || '',
        fechaInicio: formatDateForInput(initialData.fechaInicio) || formatDateForInput(new Date()),
        fechaFin: formatDateForInput(initialData.fechaFin) || '',
        alertaDias: initialData.alertaDias || 3,
      };
    }
    return INITIAL_FORM_STATE;
  });

  const [errors, setErrors] = useState({});

  /**
   * Actualiza un campo del formulario y limpia su error
   * @param {string} field
   * @param {any} value
   */
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  /**
   * Maneja cambios de inputs nativos
   * @param {Event} e
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  }, [handleChange]);

  /**
   * Valida todos los campos del formulario
   * @returns {boolean} true si el formulario es válido
   */
  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio.';
    } else if (formData.titulo.trim().length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres.';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoría.';
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de vencimiento es obligatoria.';
    } else if (!isValidDateRange(formData.fechaInicio, formData.fechaFin)) {
      newErrors.fechaFin = ERROR_MESSAGES.INVALID_DATE;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Resetea el formulario al estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    handleChange,
    handleInputChange,
    validate,
    resetForm,
    setFormData,
  };
};

export default useTaskForm;
