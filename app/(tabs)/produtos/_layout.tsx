import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProdutosStackLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: palette.card,
        },
        headerTintColor: palette.tint,
        headerTitleStyle: {
          color: palette.text,
          fontWeight: '700',
        },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="novo" options={{ title: 'Novo produto' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar produto' }} />
      <Stack.Screen name="movimentacoes/[id]" options={{ title: 'Movimentacoes' }} />
    </Stack>
  );
}
