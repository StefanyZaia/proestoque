import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, InternalAxiosRequestConfig, isAxiosError } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const AUTH_STORAGE_KEY = '@proestoque/auth';

const API_PORT = 3333;

type StoredAuthSession = {
  user?: unknown;
  token?: string | null;
  refreshToken?: string | null;
};

type RefreshResponse = {
  token: string;
  refreshToken?: string;
  user?: unknown;
  usuario?: unknown;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type ApiErrorBody = {
  erro?: string;
  message?: string;
  detalhes?: { campo?: string; mensagem?: string }[];
};

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const body = error.response?.data;
  const detailMessage = body?.detalhes?.map((detail) => detail.mensagem).filter(Boolean).join('\n');

  if (detailMessage) return detailMessage;
  if (body?.erro) return body.erro;
  if (body?.message) return body.message;
  if (!error.response) return 'Sem conexao com a API.';

  return fallback;
}

let refreshPromise: Promise<string | null> | null = null;
let onSessionChange: ((session: StoredAuthSession | null) => void) | null = null;

export function setAuthSessionChangeHandler(
  handler: ((session: StoredAuthSession | null) => void) | null
) {
  onSessionChange = handler;
}

function getDevelopmentApiUrl() {
  const hostUri = Constants.expoConfig?.hostUri;
  const expoHost = hostUri?.replace(/^https?:\/\//, '').split(':')[0];

  if (expoHost) {
    return `http://${expoHost}:${API_PORT}/api`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${API_PORT}/api`;
  }

  return `http://localhost:${API_PORT}/api`;
}

const BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  (__DEV__
    ? getDevelopmentApiUrl()
    : 'https://sua-api-em-producao.com/api');

async function getStoredSession() {
  const storedSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  return JSON.parse(storedSession) as StoredAuthSession;
}

async function clearStoredSession() {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  onSessionChange?.(null);
}

async function refreshAccessToken() {
  const session = await getStoredSession();

  if (!session?.refreshToken) {
    await clearStoredSession();
    return null;
  }

  try {
    const response = await axios.post<RefreshResponse>(`${BASE_URL}/auth/refresh`, {
      refreshToken: session.refreshToken,
    });

    const nextSession: StoredAuthSession = {
      ...session,
      user: response.data.user ?? response.data.usuario ?? session.user,
      token: response.data.token,
      refreshToken: response.data.refreshToken ?? session.refreshToken,
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    onSessionChange?.(nextSession);

    return nextSession.token ?? null;
  } catch {
    await clearStoredSession();
    return null;
  }
}

// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const storedSession = await getStoredSession();

  if (storedSession?.token) {
    config.headers.Authorization = `Bearer ${storedSession.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isAuthRequest = originalRequest?.url?.includes('/auth/');

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const token = await refreshPromise;

    if (!token) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${token}`;

    return api(originalRequest);
  }
);
