import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { api, AUTH_STORAGE_KEY, setAuthSessionChangeHandler } from '@/src/services/api';
import { agendarVerificacaoDiaria, solicitarPermissao } from '@/src/services/notifications';

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

const BOOTSTRAP_TIMEOUT_MS = 8000;

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

  const aplicarSessao = useCallback((session: StoredAuthSession) => {
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
  }, []);

  const limparSessaoLocal = useCallback(() => {
    aplicarSessao({
      user: null,
      token: null,
      refreshToken: null,
    });
  }, [aplicarSessao]);

  const salvarSessao = useCallback(async (loggedUser: User, authToken: string, refreshToken: string) => {
    const session = {
      user: loggedUser,
      token: authToken,
      refreshToken,
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    aplicarSessao(session);
  }, [aplicarSessao]);

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
  }, [aplicarSessao, limparSessaoLocal]);

  useEffect(() => {
    if (hasBootstrappedAuth) {
      return;
    }

    const getStoredSession = () =>
      Promise.race([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), BOOTSTRAP_TIMEOUT_MS);
        }),
      ]);

    const restoreSession = async () => {
      const minimumSplashDelay = new Promise((resolve) => setTimeout(resolve, 2600));

      try {
        const [storedSession] = await Promise.all([
          getStoredSession(),
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
  }, [aplicarSessao]);

  useEffect(() => {
    if (!token) return;

    const prepararNotificacoes = async () => {
      const autorizado = await solicitarPermissao();

      if (autorizado) {
        await agendarVerificacaoDiaria();
      }
    };

    void prepararNotificacoes();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
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
  }, [salvarSessao]);

  const registrar = useCallback(async (nome: string, email: string, password: string) => {
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
  }, [login, salvarSessao]);

  const logout = useCallback(async () => {
    setIsLoading(true);

    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    limparSessaoLocal();
    setIsLoading(false);
  }, [limparSessaoLocal]);

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
    [user, token, isLoading, isBootstrapping, login, registrar, logout]
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
