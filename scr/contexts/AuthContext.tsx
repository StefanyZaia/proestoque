import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { api, AUTH_STORAGE_KEY, setAuthSessionChangeHandler } from '@/services/api';

let hasBootstrappedAuth = false;

let cachedAuthSession: {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
} = {
  user: null,
  token: null,
  refreshToken: null,
};

export type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthResponse = {
  token: string;
  refreshToken?: string;
  user?: User;
  usuario?: User;
};

type StoredAuthSession = {
  user?: User | null;
  token?: string | null;
  refreshToken?: string | null;
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

  function aplicarSessao(session: StoredAuthSession) {
    const nextUser = session.user ?? null;
    const nextToken = session.token ?? null;
    const nextRefreshToken = session.refreshToken ?? null;

    cachedAuthSession = {
      user: nextUser,
      token: nextToken,
      refreshToken: nextRefreshToken,
    };

    setUser(nextUser);
    setToken(nextToken);
  }

  function limparSessaoLocal() {
    aplicarSessao({
      user: null,
      token: null,
      refreshToken: null,
    });
  }

  async function salvarSessao(loggedUser: User, authToken: string, refreshToken: string) {
    const session = {
      user: loggedUser,
      token: authToken,
      refreshToken,
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    aplicarSessao(session);
  }

  useEffect(() => {
    setAuthSessionChangeHandler((session) => {
      if (!session?.token || !session.user) {
        limparSessaoLocal();
        return;
      }

      aplicarSessao(session as StoredAuthSession);
    });

    return () => {
      setAuthSessionChangeHandler(null);
    };
  }, []);

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
          const parsedSession = JSON.parse(storedSession) as StoredAuthSession;

          aplicarSessao(parsedSession);
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
      const refreshToken = response.data.refreshToken;

      if (!loggedUser || !authToken || !refreshToken) {
        throw new Error('Resposta invalida do servidor ao fazer login.');
      }

      await salvarSessao(loggedUser, authToken, refreshToken);
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
      const refreshToken = response.data.refreshToken;

      if (loggedUser && authToken && refreshToken) {
        await salvarSessao(loggedUser, authToken, refreshToken);
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
    limparSessaoLocal();
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
