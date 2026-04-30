import { useMemo, useState } from 'react';
import {
  FlatList,
  ScrollView,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  CATEGORIAS_MOCK,
  formatarPreco,
  PRODUTOS_MOCK,
  type Categoria,
  type Produto,
} from '@/scr/data/mockData';

type ViewMode = 'lista' | 'grade' | 'categorias';

type ProductSection = {
  title: string;
  categoria: Categoria;
  data: Produto[];
};

export default function ProdutosScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('categorias');
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter((produto) => {
      const matchesSearch = produto.nome.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory ? produto.categoriaId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchText, selectedCategory]);

  const secoesAgrupadas = useMemo<ProductSection[]>(() => {
    const categoriaById = new Map(CATEGORIAS_MOCK.map((categoria) => [categoria.id, categoria]));

    return CATEGORIAS_MOCK.map((categoria) => ({
      title: categoria.nome,
      categoria,
      data: produtosFiltrados.filter((produto) => produto.categoriaId === categoria.id),
    })).filter((section) => section.data.length > 0);
  }, [produtosFiltrados]);

  const getCategoria = (categoriaId: string) =>
    CATEGORIAS_MOCK.find((categoria) => categoria.id === categoriaId)?.nome ?? categoriaId;

  const getStatusProduto = (produto: Produto) => {
    if (produto.quantidade === 0) {
      return { status: 'Sem estoque', cor: '#FADADD', textoCor: '#A44D5F' };
    }

    if (produto.quantidade < produto.quantidadeMinima) {
      return { status: 'Baixo', cor: '#FCE5D3', textoCor: '#B36A2E' };
    }

    return { status: 'Normal', cor: '#DDF4E4', textoCor: '#478A64' };
  };

  const renderProdutoCard = (item: Produto, compact = false) => {
    const { status, cor, textoCor } = getStatusProduto(item);

    return (
      <ThemedView
        lightColor="#FFF8F1"
        darkColor="#3A2E4A"
        style={[
          styles.produtoCard,
          { borderColor: palette.border },
          compact && styles.produtoCardCompact,
        ]}>
        <View style={styles.produtoHeader}>
          <ThemedText style={styles.produtoNome}>{item.nome}</ThemedText>
          <View style={[styles.badge, { backgroundColor: cor }]}>
            <ThemedText style={[styles.badgeText, { color: textoCor }]}>{status}</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.produtoMeta}>
          {item.quantidade} {item.unidade} em estoque
        </ThemedText>
        <ThemedText style={styles.produtoMeta}>{formatarPreco(item.preco)}</ThemedText>
        {!compact ? (
          <>
            <ThemedText style={styles.produtoCategoria}>Categoria: {getCategoria(item.categoriaId)}</ThemedText>
            <ThemedText style={styles.produtoMeta}>
              Ultima mov.: {new Date(item.ultimaMovimentacao).toLocaleDateString('pt-BR')}
            </ThemedText>
          </>
        ) : null}
      </ThemedView>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>Nenhum produto encontrado</ThemedText>
      <ThemedText style={styles.emptySubtext}>Tente ajustar a busca, a categoria ou o modo de visualizacao.</ThemedText>
    </View>
  );

  const renderFlatItem = ({ item }: { item: Produto }) => (
    <View style={viewMode === 'grade' ? styles.gridItemWrapper : undefined}>
      {renderProdutoCard(item, viewMode === 'grade')}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView lightColor="#F8EFE6" darkColor="#32273F" style={[styles.header, { borderBottomColor: palette.border }]}>
        <ThemedText type="title" style={styles.titulo}>
          Produtos
        </ThemedText>

        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
              color: palette.text,
            },
          ]}
          placeholder="Buscar produtos..."
          placeholderTextColor={palette.icon}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.viewToggle}>
          {([
            ['lista', 'Lista'],
            ['grade', 'Grade'],
            ['categorias', 'Categorias'],
          ] as const).map(([mode, label]) => {
            const selected = viewMode === mode;

            return (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.toggleChip,
                  {
                    backgroundColor: selected ? palette.tint : palette.card,
                    borderColor: palette.border,
                  },
                ]}
                onPress={() => setViewMode(mode)}>
                <ThemedText style={[styles.toggleChipText, selected && styles.toggleChipTextSelected]}>
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
          <TouchableOpacity
            style={[
              styles.chip,
              {
                backgroundColor: selectedCategory === null ? palette.tint : palette.card,
                borderColor: palette.border,
              },
            ]}
            onPress={() => setSelectedCategory(null)}>
            <ThemedText style={[styles.chipText, selectedCategory === null && styles.chipTextSelected]}>
              Todas
            </ThemedText>
          </TouchableOpacity>

          {CATEGORIAS_MOCK.map((categoria) => (
            <TouchableOpacity
              key={categoria.id}
              style={[
                styles.chip,
                {
                  backgroundColor: selectedCategory === categoria.id ? palette.tint : categoria.cor,
                  borderColor: palette.border,
                },
              ]}
              onPress={() => setSelectedCategory(categoria.id)}>
              <ThemedText style={[styles.chipText, selectedCategory === categoria.id && styles.chipTextSelected]}>
                {categoria.nome}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {viewMode === 'categorias' ? (
        <SectionList
          sections={secoesAgrupadas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderProdutoCard(item)}
          renderSectionHeader={({ section }) => (
            <ThemedView
              lightColor="#F7EFE5"
              darkColor="#2D233A"
              style={[styles.sectionHeader, { borderBottomColor: palette.border }]}>
              <ThemedText type="defaultSemiBold">{section.title}</ThemedText>
              <ThemedText style={styles.sectionCount}>{section.data.length} itens</ThemedText>
            </ThemedView>
          )}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          key={viewMode}
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderFlatItem}
          numColumns={viewMode === 'grade' ? 2 : 1}
          columnWrapperStyle={viewMode === 'grade' ? styles.gridRow : undefined}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    padding: 24,
    paddingBottom: 16,
  },
  titulo: {
    marginBottom: 16,
  },
  searchInput: {
    borderRadius: 14,
    borderWidth: 1,
    height: 46,
    marginBottom: 14,
    paddingHorizontal: 14,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  toggleChip: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toggleChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleChipTextSelected: {
    color: '#FFFFFF',
  },
  chipsContainer: {
    paddingRight: 24,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  listContainer: {
    flexGrow: 1,
    padding: 24,
  },
  gridRow: {
    gap: 12,
  },
  gridItemWrapper: {
    flex: 1,
  },
  produtoCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  produtoCardCompact: {
    minHeight: 145,
  },
  produtoHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  produtoNome: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  produtoMeta: {
    fontSize: 13,
    marginBottom: 4,
  },
  produtoCategoria: {
    fontSize: 13,
    marginTop: 4,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    paddingTop: 2,
  },
  sectionCount: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
