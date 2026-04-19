import { PropsWithChildren, ReactElement } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';

type ParallaxScrollViewProps = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: {
    light: string;
    dark: string;
  };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: ParallaxScrollViewProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ThemedView
        lightColor={headerBackgroundColor.light}
        darkColor={headerBackgroundColor.dark}
        style={styles.header}>
        <View style={styles.headerImage}>{headerImage}</View>
      </ThemedView>
      <ThemedView style={styles.body}>{children}</ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  header: {
    height: 240,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  headerImage: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  body: {
    flex: 1,
    gap: 16,
    padding: 24,
  },
});
