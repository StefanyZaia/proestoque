import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { setLoggedIn } from '@/lib/session';
import LogoProEstoque from '../../scr/components/LogoProEstoque';

const colors = {
  primary: '#F4A7D8',
  background: '#F6EEFF',
  surface: '#FFF9FF',
  text: '#3F3654',
  textLight: '#7A6C96',
  border: '#DECEF6',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <View style={styles.backgroundTop} />
          <View style={styles.backgroundBottom} />

          <View style={styles.card}>
            <View style={styles.header}>
              <LogoProEstoque />
              <Text style={styles.subtitle}>Gerenciador</Text>
            </View>

            <View style={styles.form}>
              <View>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputRow}>
                  <Text style={styles.inputAdornment}>@</Text>
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="seu@email.com"
                    placeholderTextColor={colors.textLight}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Digite sua senha"
                    placeholderTextColor={colors.textLight}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword((value) => !value)}>
                    <Text style={styles.inputToggle}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setLoggedIn(true);
                  router.replace('/');
                }}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>

              <View style={styles.links}>
                <TouchableOpacity onPress={() => router.push('/recuperar-senha')}>
                  <Text style={styles.link}>Esqueceu a senha?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/cadastro')}>
                  <Text style={styles.link}>Criar conta</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  backgroundTop: {
    backgroundColor: '#E8D8FF',
    borderRadius: 999,
    height: 220,
    position: 'absolute',
    right: -60,
    top: -40,
    width: 220,
  },
  backgroundBottom: {
    backgroundColor: '#FFDDF3',
    borderRadius: 999,
    bottom: -80,
    height: 250,
    left: -90,
    position: 'absolute',
    width: 250,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderColor: '#EFE4FF',
    borderRadius: 28,
    borderWidth: 1,
    elevation: 8,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#9F7AEA',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputAdornment: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  inputWithIcon: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  inputToggle: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '700',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginTop: 16,
    paddingVertical: 14,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  link: {
    color: '#7A6AA6',
    fontSize: 14,
    fontWeight: '600',
  },
});
