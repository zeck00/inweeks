import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useDarkMode(): [boolean, () => void] {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(
    'inweeks_darkmode',
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggle = useCallback(() => {
    setDarkMode(prev => !prev);
  }, [setDarkMode]);

  return [darkMode, toggle];
}
