import { Text, TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'defaultSemiBold' | 'title' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.default,
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: Fonts.default,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 36,
  },
  link: {
    color: '#0A7EA4',
    fontFamily: Fonts.default,
    fontSize: 16,
    lineHeight: 24,
  },
});
