import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  error: '#FF6B6B',
};

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorConfirmar, setErrorConfirmar] = useState('');
  const router = useRouter();

  const handleCriarConta = () => {
    if (senha !== confirmarSenha) {
      setErrorConfirmar('As senhas não coincidem');
      return;
    }
    setErrorConfirmar('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
              <Text style={styles.subtitle}>Criar Conta</Text>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
              <Input
                placeholder="Nome completo"
                value={nome}
                onChangeText={setNome}
              />

              <Input
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <Input
                placeholder="Digite sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />

              <Input
                placeholder="Confirme sua senha"
                value={confirmarSenha}
                onChangeText={(text) => {
                  setConfirmarSenha(text);
                  if (errorConfirmar) setErrorConfirmar('');
                }}
                secureTextEntry
                error={errorConfirmar}
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleCriarConta}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Criar Conta</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.link} onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>Já tenho conta</Text>
              </TouchableOpacity>
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
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});