import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  currentTheme: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Function to get system preference
  const getSystemPreference = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Function to apply theme
  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    let shouldBeDark = false;

    if (theme === 'system') {
      shouldBeDark = getSystemPreference();
    } else {
      shouldBeDark = theme === 'dark';
    }

    setIsDark(shouldBeDark);
    
    // Apply to document
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('taskflow-theme') as 'light' | 'dark' | 'system' | null;
    const savedSettings = localStorage.getItem('taskflow-settings');
    
    let themeToApply: 'light' | 'dark' | 'system' = 'system';

    // Check settings first
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.appearance?.theme) {
          themeToApply = settings.appearance.theme;
        }
      } catch (error) {
        console.error('Error parsing settings:', error);
      }
    }
    
    // Fallback to saved theme
    if (!savedSettings && savedTheme) {
      themeToApply = savedTheme;
    }

    setCurrentTheme(themeToApply);
    applyTheme(themeToApply);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Update theme when currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme);
    localStorage.setItem('taskflow-theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setCurrentTheme(newTheme);
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};