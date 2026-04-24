/**
 * @file useDebounce.js
 * @description Hook para debounce de valores (útil en búsquedas)
 */

import { useState, useEffect } from 'react';

/**
 * Retarda la actualización de un valor para evitar llamadas excesivas
 * @param {any} value - Valor a debounce
 * @param {number} delay - Retraso en milisegundos
 * @returns {any} Valor con debounce aplicado
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
