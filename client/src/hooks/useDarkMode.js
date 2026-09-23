import { useState, useEffect, useCallback } from 'react';

// Custom hook: persists and applies dark mode via the <html> class
export default function useDarkMode() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', enabled);
    localStorage.setItem('theme', enabled ? 'dark' : 'light');
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((prev) => !prev), []);

  return [enabled, toggle];
}
