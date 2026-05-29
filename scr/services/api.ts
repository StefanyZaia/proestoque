import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export const AUTH_STORAGE_KEY = '@proestoque/auth';

const API_PORT = 3333;

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
  process.env.EXPO_PUBLIC_API_URL ??
  (__DEV__
    ? getDevelopmentApiUrl()
    : 'https://sua-api-em-producao.com/api');

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const storedSession = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

  if (storedSession) {
    const parsedSession = JSON.parse(storedSession) as {
      token?: string | null;
    };

    if (parsedSession.token) {
      config.headers.Authorization = `Bearer ${parsedSession.token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }

    return Promise.reject(error);
  }
);
