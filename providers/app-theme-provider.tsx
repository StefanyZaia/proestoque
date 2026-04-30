import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

export type AppColorScheme = 'light' | 'dark';

type AppThemeContextValue = {
  colorScheme: AppColorScheme;
  setColorScheme: (scheme: AppColorScheme) => void;
  toggleColorScheme: () => void;
};

const STORAGE_KEY = 'proestoque-theme';
const AppThemeContext = createContext<AppThemeContextValue | null>(null);

declare global {
  // eslint-disable-next-line no-var
  var __PROESTOQUE_THEME__: AppColorScheme | undefined;
}

function readStoredScheme(): AppColorScheme {
  if (globalThis.__PROESTOQUE_THEME__) {
    return globalThis.__PROESTOQUE_THEME__;
  }

  if (typeof globalThis.localStorage !== 'undefined') {
    const stored = globalThis.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      globalThis.__PROESTOQUE_THEME__ = stored;
      return stored;
    }
  }

  return 'light';
}

function persistScheme(scheme: AppColorScheme) {
  globalThis.__PROESTOQUE_THEME__ = scheme;

  if (typeof globalThis.localStorage !== 'undefined') {
    globalThis.localStorage.setItem(STORAGE_KEY, scheme);
  }
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const [colorScheme, setColorSchemeState] = useState<AppColorScheme>(readStoredScheme);

  useEffect(() => {
    const storedScheme = readStoredScheme();
    setColorSchemeState(storedScheme);
  }, []);

  const setColorScheme = (scheme: AppColorScheme) => {
    persistScheme(scheme);
    setColorSchemeState(scheme);
  };

  const value = useMemo(
    () => ({
      colorScheme,
      setColorScheme,
      toggleColorScheme: () => setColorScheme(colorScheme === 'light' ? 'dark' : 'light'),
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
