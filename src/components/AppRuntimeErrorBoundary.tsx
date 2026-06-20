import { Component, PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { theme } from '@/constants/theme';

type State = {
  error: Error | null;
};

export class AppRuntimeErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Erro fatal no app', error, info.componentStack);
  }

  retry = () => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Nao foi possivel abrir o app</Text>
        <Text style={styles.message}>
          O Expo Go encontrou um erro durante a inicializacao. Veja os detalhes abaixo.
        </Text>

        <ScrollView style={styles.details} contentContainerStyle={styles.detailsContent}>
          <Text selectable style={styles.detailsText}>
            {this.state.error.message}
          </Text>
          {this.state.error.stack ? (
            <Text selectable style={styles.stackText}>
              {this.state.error.stack}
            </Text>
          ) : null}
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={this.retry}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: theme.colors.textLight,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  details: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 260,
    marginBottom: 16,
  },
  detailsContent: {
    gap: 10,
    padding: 14,
  },
  detailsText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  stackText: {
    color: theme.colors.textLight,
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
