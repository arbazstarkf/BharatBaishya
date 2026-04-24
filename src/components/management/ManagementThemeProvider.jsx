'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'mgmt-theme';

const ManagementThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export function useManagementTheme() {
  return useContext(ManagementThemeContext);
}

/**
 * Provides an independent dark/light theme for the management panel.
 * Theme is stored in localStorage under 'mgmt-theme'.
 * Applies data-mgmt-theme attribute to the `.mgmt-root` wrapper div.
 * Defaults to the user's OS preference on first visit.
 */
export default function ManagementThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      setTheme(stored);
    } else {
      // Fall back to OS preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Prevent flash of wrong theme on first paint
  if (!mounted) {
    return (
      <div className="mgmt-root" style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ManagementThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="mgmt-root" data-mgmt-theme={theme}>
        {children}
      </div>
    </ManagementThemeContext.Provider>
  );
}
