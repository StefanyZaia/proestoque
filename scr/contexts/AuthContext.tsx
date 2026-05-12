import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = '@proestoque/auth';
let hasBootstrappedAuth = false;
let cachedAuthSession: { user: User | null; token: string | null } = {
  user: null,
  token: null,
};

export type User = {
  id: string;
  nome: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(cachedAuthSession.user);
  const [token, setToken] = useState<string | null>(cachedAuthSession.token);
  const [isLoading, setIsLoading] = useState(!hasBootstrappedAuth);
  const [isBootstrapping, setIsBootstrapping] = useState(!hasBootstrappedAuth);

  useEffect(() => {
    if (hasBootstrappedAuth) {
      return;
    }

    const restoreSession = async () => {
      const minimumSplashDelay = new Promise((resolve) => setTimeout(resolve, 2600));

      try {
        const [storedSession] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEY),
          minimumSplashDelay,
        ]);

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as { user: User; token: string };
          cachedAuthSession = {
            user: parsedSession.user,
            token: parsedSession.token,
          };
          setUser(parsedSession.user);
          setToken(parsedSession.token);
        }
      } catch (error) {
        console.warn('Falha ao restaurar sessao', error);
        await minimumSplashDelay;
      } finally {
        hasBootstrappedAuth = true;
        setIsBootstrapping(false);
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const normalizedEmail = email.trim().toLowerCase();
    const derivedName = normalizedEmail.split('@')[0] || 'Usuario';

    const loggedUser: User = {
      id: 'user_1',
      nome: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
      email: normalizedEmail || 'usuario@proestoque.app',
    };
    const authToken = `token-${Date.now()}`;

    await AsyncStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: loggedUser,
        token: authToken,
      })
    );

    cachedAuthSession = {
      user: loggedUser,
      token: authToken,
    };
    setUser(loggedUser);
    setToken(authToken);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    cachedAuthSession = {
      user: null,
      token: null,
    };
    setUser(null);
    setToken(null);
    setIsLoading(false);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isBootstrapping,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, isLoading, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
