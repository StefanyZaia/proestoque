import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { api, AUTH_STORAGE_KEY } from '@/services/api';

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

type AuthResponse = {
  token: string;
  user?: User;
  usuario?: User;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  registrar: (nome: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(cachedAuthSession.user);
  const [token, setToken] = useState<string | null>(cachedAuthSession.token);
  const [isLoading, setIsLoading] = useState(!hasBootstrappedAuth);
  const [isBootstrapping, setIsBootstrapping] = useState(!hasBootstrappedAuth);

  async function salvarSessao(loggedUser: User, authToken: string) {
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
  }

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
          const parsedSession = JSON.parse(storedSession) as {
            user: User;
            token: string;
          };

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

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await api.post<AuthResponse>('/auth/login', {
        email: normalizedEmail,
        senha: password,
      });

      const loggedUser = response.data.user ?? response.data.usuario;
      const authToken = response.data.token;

      if (!loggedUser || !authToken) {
        throw new Error('Resposta inválida do servidor ao fazer login.');
      }

      await salvarSessao(loggedUser, authToken);
    } finally {
      setIsLoading(false);
    }
  };

  const registrar = async (nome: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await api.post<AuthResponse>('/auth/registro', {
        nome: nome.trim(),
        email: normalizedEmail,
        senha: password,
      });

      const loggedUser = response.data.user ?? response.data.usuario;
      const authToken = response.data.token;

      if (loggedUser && authToken) {
        await salvarSessao(loggedUser, authToken);
        return;
      }

      await login(normalizedEmail, password);
    } finally {
      setIsLoading(false);
    }
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
      registrar,
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