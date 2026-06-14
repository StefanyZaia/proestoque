import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppThemeProvider } from '@/providers/app-theme-provider';
import SplashScreen from '@/src/components/SplashScreen';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { ProductsProvider } from '@/src/contexts/ProductsContext';

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
  const { isBootstrapping } = useAuth();

  return (
    <ThemeProvider
      key={colorScheme}
      value={colorScheme === 'dark' ? navigationTheme.dark : navigationTheme.light}>
      <View style={styles.container}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        {isBootstrapping ? (
          <View pointerEvents="none" style={styles.splashOverlay}>
            <SplashScreen />
          </View>
        ) : null}
      </View>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <AppThemeProvider>
          <RootNavigation />
        </AppThemeProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});
