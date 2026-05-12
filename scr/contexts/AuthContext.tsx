import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

const AUTH_STORAGE_KEY = '@proestoque/auth';

export type User = {
  id: string;
  nome: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as { user: User; token: string };
          setUser(parsedSession.user);
          setToken(parsedSession.token);
        }
      } catch (error) {
        console.warn('Falha ao restaurar sessao', error);
      } finally {
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

    setUser(loggedUser);
    setToken(authToken);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken(null);
    setIsLoading(false);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, isLoading]
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
