import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export type AppColorScheme = 'light' | 'dark';

type AppThemeContextValue = {
  colorScheme: AppColorScheme;
  setColorScheme: (scheme: AppColorScheme) => void;
  toggleColorScheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [colorScheme, setColorScheme] = useState<AppColorScheme>('light');

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      toggleColorScheme: () =>
        setColorScheme((current) => (current === 'light' ? 'dark' : 'light')),
    }),
    [colorScheme]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }

  return context;
}
