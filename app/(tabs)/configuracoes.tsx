import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppTheme } from '@/providers/app-theme-provider';

export default function ConfiguracoesScreen() {
  const colorScheme = useColorScheme();
  const { setColorScheme, toggleColorScheme } = useAppTheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.screen}>
      <ThemedView
        lightColor="#FFF8F1"
        darkColor="#3A2E4A"
        style={[styles.card, { borderColor: palette.border }]}>
        <ThemedText type="title">Tema</ThemedText>
        <ThemedText>
          Escolha entre os temas claro e escuro para personalizar a aparência do aplicativo de acordo com sua preferência.
        </ThemedText>
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

        <Pressable onPress={toggleColorScheme} style={[styles.toggleButton, { backgroundColor: palette.tint }]}>
          <ThemedText style={styles.toggleText}>Alternar tema</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 24,
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
    marginTop: 8,
    paddingVertical: 16,
  },
  toggleText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
