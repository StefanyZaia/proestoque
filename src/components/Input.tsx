import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  style?: any;
  leftIcon?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

const colors = {
  primary: '#FFB6E1',
  secondary: '#A8D8FF',
  background: '#F5EEFF',
  surface: '#FCF8FF',
  text: '#333333',
  textLight: '#6F6785',
  border: '#DCCEF7',
  error: '#FF6B6B',
};

export default function Input({
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  style,
  leftIcon,
  autoCapitalize = 'none',
  autoCorrect = false,
}: InputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {leftIcon ? <Ionicons name={leftIcon as any} size={18} color={colors.textLight} style={styles.icon} /> : null}
        <TextInput
          style={[styles.input, leftIcon && { paddingLeft: 0 }, error && styles.inputError, style]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
