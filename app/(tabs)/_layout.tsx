import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/src/contexts/AuthContext';
import { HapticTab } from '../../src/components/haptic-tab';
import { IconSymbol } from '../../src/components/ui/icon-symbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isBootstrapping } = useAuth();
  const palette = Colors[colorScheme ?? 'light'];

  if (isBootstrapping) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.tabIconSelected,
        tabBarInactiveTintColor: palette.tabIconDefault,
        tabBarButton: (props) => <HapticTab {...(props as any)} />,
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: '/(tabs)',
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="home" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="folder" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configuracoes',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="settings" color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
