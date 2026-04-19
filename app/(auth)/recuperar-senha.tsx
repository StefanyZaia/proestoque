import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../scr/components/Input';
import LogoProEstoque from '../../scr/components/LogoProEstoque';

const colors = {
  primary: '#FFB6E1',
  secondary: '#A8D8FF',
  background: '#FFFFFF',
  surface: '#FAFAFA',
  text: '#333333',
  textLight: '#666666',
  border: '#E0E0E0',
  success: '#4CAF50',
};

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleEnviar = () => {
    // Simular envio de e-mail
    setSuccess(true);
  };

  const handleVoltarLogin = () => {
    router.push('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <LogoProEstoque />
              <Text style={styles.title}>Recuperar Senha</Text>
            </View>

            {!success ? (
              <>
                {/* Descrição */}
                <Text style={styles.description}>
                  Informe seu e-mail e enviaremos um link de recuperação
                </Text>

                {/* Formulário */}
                <View style={styles.form}>
                  <Input
                    placeholder="seu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                  />

                  <TouchableOpacity style={styles.button} onPress={handleEnviar}>
                    <Text style={styles.buttonText}>Enviar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Mensagem de sucesso */}
                <View style={styles.successContainer}>
                  <Text style={styles.successIcon}>✅</Text>
                  <Text style={styles.successTitle}>E-mail enviado!</Text>
                  <Text style={styles.successMessage}>
                    Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                  </Text>

                  <TouchableOpacity style={styles.button} onPress={handleVoltarLogin}>
                    <Text style={styles.buttonText}>Voltar ao Login</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
});