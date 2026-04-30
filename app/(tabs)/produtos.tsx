import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { COLORS } from '@/constants/theme';
import { CATEGORIAS_MOCK, PRODUTOS_MOCK } from '@/scr/data/mockData';

export default function ProdutosScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter(produto => {
      const matchesSearch = produto.nome.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory ? produto.categoriaId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  const getStatusProduto = (produto: typeof PRODUTOS_MOCK[0]) => {
    if (produto.quantidade === 0) {
      return { status: 'Sem estoque', cor: COLORS.statusSemEstoque, textoCor: COLORS.statusSemEstoqueText };
    } else if (produto.quantidade < produto.quantidadeMinima) {
      return { status: 'Baixo', cor: COLORS.statusBaixo, textoCor: COLORS.statusBaixoText };
    }
    return { status: 'Normal', cor: COLORS.statusNormal, textoCor: COLORS.statusNormalText };
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.titulo}>Produtos</ThemedText>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
          <TouchableOpacity
            style={[styles.chip, selectedCategory === null && styles.chipSelected]}
            onPress={() => setSelectedCategory(null)}
          >
            <ThemedText style={[styles.chipText, selectedCategory === null && styles.chipTextSelected]}>
              Todas
            </ThemedText>
          </TouchableOpacity>
          {CATEGORIAS_MOCK.map((categoria) => (
            <TouchableOpacity
              key={categoria.id}
              style={[styles.chip, { backgroundColor: categoria.cor }, selectedCategory === categoria.id && styles.chipSelected]}
              onPress={() => setSelectedCategory(categoria.id)}
            >
              <ThemedText style={[styles.chipText, selectedCategory === categoria.id && styles.chipTextSelected]}>
                {categoria.nome}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { status, cor, textoCor } = getStatusProduto(item);
          return (
            <View style={styles.produtoItem}>
              <View style={styles.produtoInfo}>
                <ThemedText style={styles.produtoNome}>{item.nome}</ThemedText>
                <ThemedText style={styles.produtoDetalhes}>
                  Quantidade: {item.quantidade} {item.unidade} • Preço: {item.preco.toFixed(2)} R$
                </ThemedText>
                <ThemedText style={styles.produtoCategoria}>
                  Categoria: {item.categoriaId}
                </ThemedText>
              </View>
              <View style={styles.produtoMeta}>
                <View style={[styles.badge, { backgroundColor: cor }]}>
                  <ThemedText style={[styles.badgeText, { color: textoCor }]}>
                    {status}
                  </ThemedText>
                </View>
                <ThemedText style={styles.produtoData}>
                  Última mov: {new Date(item.ultimaMovimentacao).toLocaleDateString('pt-BR')}
                </ThemedText>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Nenhum produto encontrado</ThemedText>
            <ThemedText style={styles.emptySubtext}>Tente ajustar os filtros ou a busca</ThemedText>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: COLORS.purpleLighter,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.purpleDark,
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.purpleLight,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    color: COLORS.text,
    marginBottom: 16,
  },
  chipsContainer: {
    marginBottom: 16,
  },
  chip: {
    backgroundColor: COLORS.purpleLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.purple,
  },
  chipText: {
    color: COLORS.purpleDark,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: COLORS.background,
  },
  listContainer: {
    padding: 24,
  },
  produtoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.purpleLighter,
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.purpleLight,
  },
  produtoInfo: {
    flex: 1,
    gap: 4,
  },
  produtoNome: {
    fontWeight: '600',
    fontSize: 16,
    color: COLORS.purpleDark,
  },
  produtoDetalhes: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  produtoCategoria: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  produtoMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  produtoData: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textTertiary,
  },
});