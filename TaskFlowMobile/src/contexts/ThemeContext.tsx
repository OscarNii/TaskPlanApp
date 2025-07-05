import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

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

  const getSystemPreference = () => {
    return Appearance.getColorScheme() === 'dark';
  };

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    let shouldBeDark = false;

    if (theme === 'system') {
      shouldBeDark = getSystemPreference();
    } else {
      shouldBeDark = theme === 'dark';
    }

    setIsDark(shouldBeDark);
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('taskflow-theme') as 'light' | 'dark' | 'system' | null;
        const savedSettings = await AsyncStorage.getItem('taskflow-settings');
        
        let themeToApply: 'light' | 'dark' | 'system' = 'system';

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
        
        if (!savedSettings && savedTheme) {
          themeToApply = savedTheme;
        }

        setCurrentTheme(themeToApply);
        applyTheme(themeToApply);
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (currentTheme === 'system') {
        setIsDark(colorScheme === 'dark');
      }
    });

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
    AsyncStorage.setItem('taskflow-theme', currentTheme);
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