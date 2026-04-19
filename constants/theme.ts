export const theme = {
  colors: {
    primary: '#FFB6E1',
    secondary: '#A8D8FF',
    background: '#FFFFFF',
    surface: '#FAFAFA',
    text: '#333333',
    textLight: '#666666',
    border: '#E0E0E0',
    error: '#FF6B6B',
    success: '#4CAF50',
  },
};

export const Colors = {
  light: {
    text: theme.colors.text,
    background: theme.colors.background,
    tint: theme.colors.primary,
    icon: theme.colors.textLight,
    tabIconDefault: theme.colors.textLight,
    tabIconSelected: theme.colors.primary,
    card: theme.colors.surface,
    border: theme.colors.border,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: theme.colors.secondary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: theme.colors.secondary,
    card: '#1C1E1F',
    border: '#2A2D2E',
  },
};

export const Fonts = {
  default: 'System',
  rounded: 'System',
  mono: 'monospace',
};
