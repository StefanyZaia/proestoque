import { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type CollapsibleProps = PropsWithChildren<{
  title: string;
}>;

export function Collapsible({ children, title }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={[styles.container, { borderColor }]}>
      <Pressable onPress={() => setIsOpen((value) => !value)} style={styles.trigger}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText style={[styles.icon, { color: iconColor }]}>{isOpen ? '-' : '+'}</ThemedText>
      </Pressable>
      {isOpen ? <View style={styles.content}>{children}</View> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  trigger: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  icon: {
    fontSize: 20,
    lineHeight: 20,
  },
  content: {
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
