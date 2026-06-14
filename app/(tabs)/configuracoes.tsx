import { Ionicons } from '@expo/vector-icons';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppTheme } from '@/providers/app-theme-provider';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ConfiguracoesScreen() {
  const colorScheme = useColorScheme();
  const { setColorScheme, toggleColorScheme } = useAppTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? 'light'];

  const nomeUsuario = user?.nome ?? 'Usuario';
  const emailUsuario = user?.email ?? 'usuario@proestoque.app';
  const inicialUsuario = nomeUsuario.charAt(0).toUpperCase();

  const menuItems = [
    {
      id: 'notificacoes',
      icon: 'notifications-outline' as const,
      title: 'Notificacoes',
      description: 'Gerencie alertas e avisos do app',
    },
    {
      id: 'ajuda',
      icon: 'help-circle-outline' as const,
      title: 'Ajuda',
      description: 'Veja dicas e suporte rapido',
    },
  ];

  const handleLogout = () => {
    const confirmLogout = async () => {
      await logout();
    };

    if (Platform.OS === 'web') {
      const shouldLogout = typeof window !== 'undefined'
        ? window.confirm('Tem certeza que deseja sair da sua conta?')
        : true;

      if (shouldLogout) {
        void confirmLogout();
      }
      return;
    }

    Alert.alert('Sair da conta', 'Tem certeza que deseja sair da sua conta?', [
      {
        style: 'cancel',
        text: 'Cancelar',
      },
      {
        style: 'destructive',
        text: 'Sair',
        onPress: () => {
          void confirmLogout();
        },
      },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 24) + 24 },
      ]}>
      <ThemedView
        lightColor="#FFF8F1"
        darkColor="#3A2E4A"
        style={[styles.profileCard, { borderColor: palette.border }]}>
        <View style={styles.profileRow}>
          <ThemedView
            lightColor="#F0DED1"
            darkColor="#4A3A5E"
            style={[styles.avatar, { borderColor: palette.border }]}>
            <ThemedText style={styles.avatarText}>{inicialUsuario}</ThemedText>
          </ThemedView>
          <View style={styles.profileInfo}>
            <ThemedText type="title" style={styles.profileName}>
              {nomeUsuario}
            </ThemedText>
            <ThemedText>{emailUsuario}</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView
        lightColor="#FFF8F1"
        darkColor="#3A2E4A"
        style={[styles.sectionCard, { borderColor: palette.border }]}>
        <ThemedText type="defaultSemiBold">Menu</ThemedText>
        {menuItems.map((item) => (
          <Pressable key={item.id} style={[styles.menuItem, { borderColor: palette.border }]}>
            <View style={[styles.menuIcon, { backgroundColor: palette.card }]}>
              <Ionicons name={item.icon} size={20} color={palette.tint} />
            </View>
            <View style={styles.menuText}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText>{item.description}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.icon} />
          </Pressable>
        ))}
      </ThemedView>

      <ThemedView
        lightColor="#FFF8F1"
        darkColor="#3A2E4A"
        style={[styles.sectionCard, { borderColor: palette.border }]}>
        <ThemedText type="defaultSemiBold">Tema</ThemedText>
        <ThemedText>Escolha entre os temas claro e escuro para personalizar o app.</ThemedText>
        <ThemedText type="defaultSemiBold">
          Tema atual: {colorScheme === 'dark' ? 'Escuro' : 'Claro'}
        </ThemedText>

        <Pressable
          onPress={() => setColorScheme('light')}
          style={[
            styles.option,
            { borderColor: palette.border },
            colorScheme === 'light' && styles.optionSelectedLight,
          ]}>
          <ThemedText type="defaultSemiBold">Claro</ThemedText>
        </Pressable>

        <Pressable
          onPress={() => setColorScheme('dark')}
          style={[
            styles.option,
            { borderColor: palette.border },
            colorScheme === 'dark' && styles.optionSelectedDark,
          ]}>
          <ThemedText type="defaultSemiBold">Escuro</ThemedText>
        </Pressable>

        <Pressable
          onPress={toggleColorScheme}
          style={[styles.toggleButton, { backgroundColor: palette.tint }]}>
          <ThemedText style={styles.toggleText}>Alternar tema</ThemedText>
        </Pressable>
      </ThemedView>

      <Pressable onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
        <ThemedText style={styles.logoutText}>Sair da conta</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 24,
  },
  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 24,
    lineHeight: 28,
  },
  sectionCard: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
  menuItem: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 14,
  },
  menuIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  menuText: {
    flex: 1,
    gap: 2,
  },
  option: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  optionSelectedLight: {
    backgroundColor: '#F3DFCF',
  },
  optionSelectedDark: {
    backgroundColor: '#4A3A5E',
  },
  toggleButton: {
    alignItems: 'center',
    borderRadius: 18,
    marginTop: 4,
    paddingVertical: 16,
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#D97B93',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
