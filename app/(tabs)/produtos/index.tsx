import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { ErrorView } from '@/src/components/ErrorView';
import { ProdutoListaSkeleton } from '@/src/components/ProdutoSkeleton';
import { useCategorias } from '@/src/hooks/useCategorias';
import type { Categoria, Produto } from '@/src/types/estoque';
import { formatCurrency } from '@/src/utils/formatters';

type ViewMode = 'lista' | 'grade' | 'categorias';

type ProductSection = {
  title: string;
  categoria: Categoria;
  data: Produto[];
};

function mixWithWhite(hexColor: string, amount = 0.72) {
  const normalized = hexColor.replace('#', '');

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return '#F2DDEC';
  }

  const channels = [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16));
  const mixed = channels.map((channel) => Math.round(channel + (255 - channel) * amount));

  return `#${mixed.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

export default function ProdutosScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('categorias');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const { categorias } = useCategorias();
  const palette = Colors[colorScheme ?? 'light'];

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const matchesSearch = produto.nome.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory ? produto.categoriaId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [produtos, searchText, selectedCategory]);

  const secoesAgrupadas = useMemo<ProductSection[]>(() => {
    return categorias.map((categoria) => ({
      title: categoria.nome,
      categoria,
      data: produtosFiltrados.filter((produto) => produto.categoriaId === categoria.id),
    })).filter((section) => section.data.length > 0);
  }, [categorias, produtosFiltrados]);

  const getCategoria = (categoriaId: string) =>
    categorias.find((categoria) => categoria.id === categoriaId)?.nome ?? categoriaId;

  const getStatusProduto = (produto: Produto) => {
    if (produto.quantidade === 0) {
      return { status: 'Sem estoque', cor: '#FADADD', textoCor: '#A44D5F' };
    }

    if (produto.quantidade < produto.quantidadeMinima) {
      return { status: 'Baixo', cor: '#FCE5D3', textoCor: '#B36A2E' };
    }

    return { status: 'Normal', cor: '#DDF4E4', textoCor: '#478A64' };
  };

  const handleOpenProduto = (produtoId: string) => {
    router.push((`/produtos/${produtoId}`) as never);
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
        <View style={[styles.produtoHeader, compact && styles.produtoHeaderCompact]}>
          <View style={[styles.produtoTitleRow, compact && styles.produtoTitleRowCompact]}>
            {item.foto ?? item.fotoUri ? (
              <Image source={{ uri: item.foto ?? item.fotoUri }} style={styles.produtoThumb} />
            ) : (
              <View style={[styles.produtoThumbPlaceholder, { borderColor: palette.border }]}>
                <ThemedText style={styles.produtoThumbPlaceholderText}>IMG</ThemedText>
              </View>
            )}
            <ThemedText
              numberOfLines={compact ? 2 : undefined}
              style={[styles.produtoNome, compact && styles.produtoNomeCompact]}>
              {item.nome}
            </ThemedText>
          </View>
          <View style={[styles.badge, compact && styles.badgeCompact, { backgroundColor: cor }]}>
            <ThemedText style={[styles.badgeText, { color: textoCor }]}>{status}</ThemedText>
          </View>
        </View>

        <ThemedText style={styles.produtoMeta}>
          {item.quantidade} {item.unidade} em estoque
        </ThemedText>
        <ThemedText style={styles.produtoMeta}>{formatCurrency(item.preco)}</ThemedText>
        {!compact ? (
          <>
            <ThemedText style={styles.produtoCategoria}>
              Categoria: {getCategoria(item.categoriaId)}
            </ThemedText>
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
      <ThemedText style={styles.emptySubtext}>
        Tente ajustar a busca, a categoria ou o modo de visualizacao.
      </ThemedText>
    </View>
  );

  const renderFlatItem = ({ item }: { item: Produto }) => (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => handleOpenProduto(item.id)}
      style={viewMode === 'grade' ? styles.gridItemWrapper : undefined}>
      {renderProdutoCard(item, viewMode === 'grade')}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        lightColor="#F8EFE6"
        darkColor="#32273F"
        style={[styles.header, { borderBottomColor: palette.border, paddingTop: insets.top + 20 }]}>
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.titulo}>
            Produtos
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.push('/produtos/novo' as never)}
            style={[styles.addButton, { backgroundColor: palette.tint }]}>
            <ThemedText style={styles.addButtonText}>+</ThemedText>
          </TouchableOpacity>
        </View>

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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}>
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

          {categorias.map((categoria) => (
            <TouchableOpacity
              key={categoria.id}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    colorScheme === 'dark'
                      ? selectedCategory === categoria.id
                        ? palette.tint
                        : categoria.cor
                      : mixWithWhite(categoria.cor, selectedCategory === categoria.id ? 0.55 : 0.76),
                  borderColor:
                    colorScheme === 'dark' ? palette.border : mixWithWhite(categoria.cor, 0.58),
                },
              ]}
              onPress={() =>
                setSelectedCategory((current) => (current === categoria.id ? null : categoria.id))
              }>
              <ThemedText
                style={[
                  styles.chipText,
                  selectedCategory === categoria.id && colorScheme === 'dark' && styles.chipTextSelected,
                ]}>
                {categoria.nome}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {isLoading && produtos.length === 0 ? (
        <View style={styles.listContainer}>
          <ProdutoListaSkeleton count={8} />
        </View>
      ) : error && produtos.length === 0 ? (
        <ErrorView mensagem={error} onRetry={carregarProdutos} />
      ) : viewMode === 'categorias' ? (
        <SectionList
          sections={secoesAgrupadas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.88} onPress={() => handleOpenProduto(item.id)}>
              {renderProdutoCard(item)}
            </TouchableOpacity>
          )}
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
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={carregarProdutos} />}
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
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={carregarProdutos} />}
        />
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push('/produtos/novo' as never)}
        style={[styles.fab, { backgroundColor: palette.tint }]}>
        <ThemedText style={styles.fabText}>+</ThemedText>
      </TouchableOpacity>
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
  headerTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titulo: {
    marginBottom: 16,
  },
  addButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
    width: 40,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
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
    justifyContent: 'space-between',
  },
  gridItemWrapper: {
    flex: 1,
    maxWidth: '48.5%',
    minWidth: '48%',
  },
  produtoCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  produtoCardCompact: {
    minHeight: 176,
    padding: 12,
  },
  produtoHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  produtoHeaderCompact: {
    flexDirection: 'column',
    gap: 10,
  },
  produtoTitleRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minWidth: 0,
  },
  produtoTitleRowCompact: {
    width: '100%',
  },
  produtoThumb: {
    borderRadius: 12,
    height: 46,
    width: 46,
  },
  produtoThumbPlaceholder: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    borderWidth: 1,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  produtoThumbPlaceholderText: {
    fontSize: 10,
    fontWeight: '700',
  },
  produtoNome: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    minWidth: 0,
  },
  produtoNomeCompact: {
    fontSize: 14,
    lineHeight: 18,
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
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexShrink: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeCompact: {
    alignSelf: 'flex-start',
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
  fab: {
    alignItems: 'center',
    borderRadius: 28,
    bottom: 24,
    elevation: 6,
    height: 56,
    justifyContent: 'center',
    position: 'absolute',
    right: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    width: 56,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 28,
  },
});
