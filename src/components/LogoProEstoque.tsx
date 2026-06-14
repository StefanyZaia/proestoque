import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface LogoProEstoqueProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
  const getSize = () => {
    switch (size) {
      case 'sm':
        return { icon: 32, font: 20 };
      case 'lg':
        return { icon: 64, font: 36 };
      default:
        return { icon: 48, font: 28 };
    }
  };

  const { icon, font } = getSize();

  return (
    <View style={styles.container}>
      <Ionicons name="cube-outline" size={icon} color={theme.colors.primary} />
      <Text style={[styles.text, { fontSize: font }]}>ProEstoque</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 8,
  },
});