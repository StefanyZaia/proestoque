import { Stack } from 'expo-router';

import { theme } from '@/constants/theme';

export default function ProdutosStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.primary,
        headerTitleStyle: {
          color: theme.colors.text,
          fontWeight: '700',
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'Produtos' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo produto' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar produto' }} />
    </Stack>
  );
}
