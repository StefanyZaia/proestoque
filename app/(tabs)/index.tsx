import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  CATEGORIAS_MOCK,
  formatarPreco,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
  PRODUTOS_MOCK,
} from '@/scr/data/mockData';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const nomeUsuario = 'Stefy';
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const produtosComEstoqueBaixo = getProdutosComEstoqueBaixo();
  const produtosRecentes = PRODUTOS_MOCK.slice(-5).reverse();

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const resumoCards = [
    {
      id: 'total',
      titulo: 'Total de Produtos',
      valor: PRODUTOS_MOCK.length.toString(),
      cor: colorScheme === 'dark' ? '#4A3A5E' : '#F0DED1',
    },
    {
      id: 'alertas',
      titulo: 'Alertas de Estoque',
      valor: produtosComEstoqueBaixo.length.toString(),
      cor: colorScheme === 'dark' ? '#5A3850' : '#F8DDE8',
    },
    {
      id: 'categorias',
      titulo: 'Categorias',
      valor: CATEGORIAS_MOCK.length.toString(),
      cor: colorScheme === 'dark' ? '#3C425F' : '#E8E1D8',
    },
    {
      id: 'valor',
      titulo: 'Valor Total',
      valor: formatarPreco(getValorTotalEstoque()),
      cor: colorScheme === 'dark' ? '#355148' : '#E6EFE4',
    },
  ];

  return (
    <FlatList
      data={produtosRecentes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ThemedView
          lightColor="#FFF8F1"
          darkColor="#3A2E4A"
          style={[styles.produtoItem, { borderColor: palette.border }]}>
          <View style={styles.produtoInfo}>
            <ThemedText style={styles.produtoNome}>{item.nome}</ThemedText>
            <ThemedText style={styles.produtoQuantidade}>
              {item.quantidade} {item.unidade} • {formatarPreco(item.preco)}
            </ThemedText>
          </View>
        </ThemedView>
      )}
      ListHeaderComponent={
        <ThemedView style={styles.headerContent}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">{`Ola, ${nomeUsuario}`}</ThemedText>
            <ThemedText>{dataHoje}</ThemedText>
            <ThemedText type="defaultSemiBold">
            </ThemedText>
          </ThemedView>

          <View style={styles.grid}>
            {resumoCards.map((card) => (
              <ThemedView key={card.id} style={[styles.card, { backgroundColor: card.cor }]}>
                <ThemedText style={styles.valor}>{card.valor}</ThemedText>
                <ThemedText style={styles.titulo}>{card.titulo}</ThemedText>
              </ThemedView>
            ))}
          </View>
        </ThemedView>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={palette.tint}
          titleColor={palette.tint}
        />
      }
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  headerContent: {
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    alignItems: 'center',
    borderRadius: 16,
    gap: 8,
    padding: 16,
    width: '48%',
  },
  valor: {
    fontSize: 22,
    fontWeight: '700',
  },
  titulo: {
    fontSize: 12,
    textAlign: 'center',
  },
  produtoItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    padding: 14,
  },
  produtoInfo: {
    gap: 4,
  },
  produtoNome: {
    fontSize: 14,
    fontWeight: '600',
  },
  produtoQuantidade: {
    fontSize: 12,
  },
});
