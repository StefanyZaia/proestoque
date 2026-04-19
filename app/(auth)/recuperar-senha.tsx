import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Input from '../../scr/components/Input';
import LogoProEstoque from '../../scr/components/LogoProEstoque';

const colors = {
  primary: '#F4A7D8',
  background: '#F6EEFF',
  textLight: '#7A6C96',
  success: '#4CAF50',
};

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.backgroundTop} />
            <View style={styles.backgroundBottom} />

            <View style={styles.card}>
              <View style={styles.header}>
                <LogoProEstoque />
                <Text style={styles.title}>Recuperar Senha</Text>
              </View>

              {!success ? (
                <>
                  <Text style={styles.description}>
                    Informe seu e-mail e enviaremos um link de recuperação.
                  </Text>

                  <View style={styles.form}>
                    <Input
                      placeholder="seu@email.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                    />

                    <TouchableOpacity style={styles.button} onPress={() => setSuccess(true)}>
                      <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.successContainer}>
                  <Text style={styles.successBadge}>OK</Text>
                  <Text style={styles.successTitle}>E-mail enviado!</Text>
                  <Text style={styles.successMessage}>
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </Text>

                  <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
                    <Text style={styles.buttonText}>Voltar ao Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  backgroundTop: {
    backgroundColor: '#E8D8FF',
    borderRadius: 999,
    height: 220,
    position: 'absolute',
    right: -60,
    top: -30,
    width: 220,
  },
  backgroundBottom: {
    backgroundColor: '#FFDDF3',
    borderRadius: 999,
    bottom: -70,
    height: 240,
    left: -90,
    position: 'absolute',
    width: 240,
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
    marginBottom: 24,
  },
  title: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
  },
  description: {
    color: colors.textLight,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    gap: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginTop: 12,
    paddingVertical: 14,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successBadge: {
    backgroundColor: '#E8F8EC',
    borderRadius: 999,
    color: colors.success,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  successTitle: {
    color: colors.success,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  successMessage: {
    color: colors.textLight,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 28,
    textAlign: 'center',
  },
});
