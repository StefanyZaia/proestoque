import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppThemeProvider } from '@/providers/app-theme-provider';
import { AuthProvider, useAuth } from '@/scr/contexts/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

const navigationTheme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.light.background,
      border: Colors.light.border,
      card: Colors.light.card,
      notification: Colors.light.tint,
      primary: Colors.light.tint,
      text: Colors.light.text,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: Colors.dark.background,
      border: Colors.dark.border,
      card: Colors.dark.card,
      notification: Colors.dark.tint,
      primary: Colors.dark.tint,
      text: Colors.dark.text,
    },
  },
};

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, router, segments]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
          },
        ]}>
        <ActivityIndicator
          size="large"
          color={colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint}
        />
      </View>
    );
  }

  return null;
}

function RootNavigation() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      key={colorScheme}
      value={colorScheme === 'dark' ? navigationTheme.dark : navigationTheme.light}>
      <NavigationGuard />
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <RootNavigation />
      </AppThemeProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
});
