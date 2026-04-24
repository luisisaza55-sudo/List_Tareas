import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('todolist_theme') || 'dark'
  );

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('todolist_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return { theme, toggleTheme };
};
