import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'system' | 'light' | 'dark';
type ResolvedTheme = 'light' | 'dark';

export type ThemeContextType = {
  theme: ResolvedTheme;         
  selectedTheme: ThemeMode;                         
  setSelectedTheme: (selectedTheme: ThemeMode) => void;
  isThemeLoaded: boolean;                    
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>('system');
  const colorScheme = useColorScheme();
  const systemTheme: ResolvedTheme = colorScheme === 'dark' ? 'dark' : 'light';
  
  /*
    Indicates whether AsyncStorage has finished loading
    Prevents UI flicker or incorrect theme on startup 
  */
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themeMode');

        if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
          setSelectedTheme(storedTheme);
        }
      } finally {
        setIsThemeLoaded(true);
      }
    };

    loadTheme();
  }, []);

  const setThemeMode = async (newTheme: ThemeMode) => {
    setSelectedTheme(newTheme);

    // Persist theme mode choice for next app launch
    try {
      await AsyncStorage.setItem('themeMode', newTheme);
    }catch (error: unknown) {
      if (error instanceof Error) {
        console.warn('Failed to persist theme:', error.message);
      } else {
        console.warn('Failed to persist theme. Unknown error:', error);
      }
    }
  };

  /*
    If user selected 'system', follow OS
    Otherwise apply the user's selected theme
  */
  const resolvedTheme: ResolvedTheme = selectedTheme === 'system' ? systemTheme : selectedTheme;

  return (
    <ThemeContext.Provider 
      value={{
        theme: resolvedTheme, 
        selectedTheme,             
        setSelectedTheme: setThemeMode, 
        isThemeLoaded,              
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return themeContext;
}