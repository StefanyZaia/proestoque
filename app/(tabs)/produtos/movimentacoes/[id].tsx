import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorView } from '@/src/components/ErrorView';
import { LoadingView } from '@/src/components/LoadingView';
import { useProducts } from '@/src/contexts/ProductsContext';
import type { Movimentacao } from '@/src/types/estoque';

export default function MovimentacoesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { getProdutoById, movimentarProduto, carregarMovimentacoes } = useProducts();
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('');
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const produto = id ? getProdutoById(id) : undefined;

  const carregar = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      setMovimentacoes(await carregarMovimentacoes(id));
    } catch {
      setError('Nao foi possivel carregar o historico.');
    } finally {
      setIsLoading(false);
    }
  }, [carregarMovimentacoes, id]);

  useEffect(() => { void carregar(); }, [carregar]);

  const salvar = async () => {
    const valor = Number(quantidade);
    if (!id || !Number.isInteger(valor) || valor <= 0) {
      Alert.alert('Quantidade invalida', 'Informe um numero inteiro maior que zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      await movimentarProduto(id, { tipo, quantidade: valor, observacao: observacao.trim() || undefined });
      setQuantidade('');
      setObservacao('');
      await carregar();
      Alert.alert('Sucesso', tipo === 'entrada' ? 'Entrada registrada.' : 'Saida registrada.');
    } catch (requestError) {
      Alert.alert('Erro', requestError instanceof Error ? requestError.message : 'Nao foi possivel registrar a movimentacao.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && movimentacoes.length === 0) return <LoadingView mensagem="Carregando historico..." />;
  if (error && movimentacoes.length === 0) return <ErrorView mensagem={error} onRetry={carregar} />;

  return (
    <FlatList
      data={movimentacoes}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={carregar} tintColor={palette.tint} />
      }
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={[styles.content, { backgroundColor: palette.background }]}
      ListHeaderComponent={
        <View style={styles.form}>
          <Text style={[styles.title, { color: palette.text }]}>{produto?.nome ?? 'Produto'}</Text>
          <Text style={[styles.stock, { color: palette.icon }]}>Estoque atual: {produto?.quantidade ?? 0} {produto?.unidade}</Text>
          <View style={styles.segmented}>
            {(['entrada', 'saida'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setTipo(option)}
                style={[
                  styles.segment,
                  { borderColor: palette.border },
                  tipo === option && { backgroundColor: palette.tint, borderColor: palette.tint },
                ]}>
                <Text
                  style={[
                    styles.segmentText,
                    { color: palette.text },
                    tipo === option && styles.segmentTextActive,
                  ]}>
                  {option === 'entrada' ? 'Entrada' : 'Saida'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
            placeholder="Quantidade"
            placeholderTextColor={palette.icon}
            style={[
              styles.input,
              { backgroundColor: palette.card, borderColor: palette.border, color: palette.text },
            ]}
          />
          <TextInput
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Observacao (opcional)"
            placeholderTextColor={palette.icon}
            style={[
              styles.input,
              { backgroundColor: palette.card, borderColor: palette.border, color: palette.text },
            ]}
          />
          <TouchableOpacity disabled={isSubmitting} onPress={() => void salvar()} style={[styles.submit, isSubmitting && styles.disabled]}>
            <Text style={styles.submitText}>{isSubmitting ? 'Registrando...' : 'Registrar movimentacao'}</Text>
          </TouchableOpacity>
          <Text style={[styles.historyTitle, { color: palette.text }]}>Historico</Text>
        </View>
      }
      ListEmptyComponent={<Text style={[styles.empty, { color: palette.icon }]}>Nenhuma movimentacao registrada.</Text>}
      renderItem={({ item }) => (
        <View style={[styles.item, { borderBottomColor: palette.border }]}>
          <View>
            <Text style={[styles.itemType, { color: palette.text }]}>{item.tipo === 'entrada' ? 'Entrada' : 'Saida'}</Text>
            <Text style={[styles.itemDate, { color: palette.icon }]}>{new Date(item.data).toLocaleString('pt-BR')}</Text>
            {item.observacao ? <Text style={[styles.itemNote, { color: palette.text }]}>{item.observacao}</Text> : null}
          </View>
          <Text style={[styles.quantity, item.tipo === 'entrada' ? styles.positive : styles.negative]}>
            {item.tipo === 'entrada' ? '+' : '-'}{item.quantidade}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  form: { gap: 12, marginBottom: 8 },
  title: { color: '#3F3654', fontSize: 22, fontWeight: '700' },
  stock: { color: '#7A6C96', fontSize: 15 },
  segmented: { flexDirection: 'row', gap: 8 },
  segment: { alignItems: 'center', borderRadius: 8, borderWidth: 1, flex: 1, padding: 12 },
  segmentText: { color: '#3F3654', fontWeight: '600' },
  segmentTextActive: { color: '#FFFFFF' },
  input: { borderColor: '#DECEF6', borderRadius: 8, borderWidth: 1, padding: 13 },
  submit: { alignItems: 'center', backgroundColor: '#7A6AA6', borderRadius: 8, padding: 14 },
  submitText: { color: '#FFFFFF', fontWeight: '700' },
  disabled: { opacity: 0.6 },
  historyTitle: { color: '#3F3654', fontSize: 18, fontWeight: '700', marginTop: 12 },
  item: { alignItems: 'center', borderBottomColor: '#E8DFF2', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  itemType: { color: '#3F3654', fontWeight: '700' },
  itemDate: { color: '#7A6C96', fontSize: 12, marginTop: 3 },
  itemNote: { color: '#5E536E', marginTop: 5 },
  quantity: { fontSize: 18, fontWeight: '800' },
  positive: { color: '#2F855A' },
  negative: { color: '#C53030' },
  empty: { color: '#7A6C96', paddingVertical: 24, textAlign: 'center' },
});
