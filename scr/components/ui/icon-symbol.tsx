import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme } from '../../../hooks/use-color-scheme';

interface IconSymbolProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

export function IconSymbol({ name, size = 24, color }: IconSymbolProps) {
  const colorScheme = useColorScheme();
  const defaultColor = color || (colorScheme === 'dark' ? '#fff' : '#000');

  return <Ionicons name={name} size={size} color={defaultColor} />;
}
