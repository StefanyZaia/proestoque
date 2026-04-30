import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppThemeProvider } from '@/providers/app-theme-provider';

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

function RootNavigation() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider
      key={colorScheme}
      value={colorScheme === 'dark' ? navigationTheme.dark : navigationTheme.light}>
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
    <AppThemeProvider>
      <RootNavigation />
    </AppThemeProvider>
  );
}
