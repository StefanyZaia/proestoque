import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Input from '../../src/components/Input';
import LogoProEstoque from '../../src/components/LogoProEstoque';
import { useAuth } from '../../src/contexts/AuthContext';
import { getApiErrorMessage } from '../../src/services/api';

const colors = {
  primary: '#F4A7D8',
  background: '#F6EEFF',
  textLight: '#7A6C96',
};

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorConfirmar, setErrorConfirmar] = useState('');
  const router = useRouter();
  const { registrar } = useAuth();

  const handleCriarConta = async () => {
    if (nome.trim().length < 2) {
      Alert.alert('Nome invalido', 'Informe um nome com pelo menos 2 caracteres.');
      return;
    }

    if (!email.trim().includes('@')) {
      Alert.alert('E-mail invalido', 'Informe um e-mail valido.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Senha invalida', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorConfirmar('As senhas não coincidem');
      return;
    }

    setErrorConfirmar('');
    try {
      setLoading(true);
      await registrar(nome, email, senha);
      router.replace('/(tabs)');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Nao foi possivel criar a conta.');
      Alert.alert('Erro no cadastro', message);
    } finally {
      setLoading(false);
    }
  };

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
                <Text style={styles.subtitle}>Criar Conta</Text>
              </View>

              <View style={styles.form}>
                <Input placeholder="Nome completo" value={nome} onChangeText={setNome} />

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
                  disabled={loading}>
                  {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Criar Conta</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.link} onPress={() => router.push('/login')}>
                  <Text style={styles.linkText}>Já tenho conta</Text>
                </TouchableOpacity>
              </View>
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
    marginBottom: 30,
  },
  subtitle: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  form: {
    gap: 8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginTop: 12,
    paddingVertical: 14,
    width: '100%',
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
    marginTop: 18,
  },
  linkText: {
    color: '#7A6AA6',
    fontSize: 14,
    fontWeight: '600',
  },
});
