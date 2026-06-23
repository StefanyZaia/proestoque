import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import ProdutoForm from '@/src/components/produtos/ProdutoForm';
import { useProducts } from '@/src/contexts/ProductsContext';
import { produtoSchema, type ProdutoFormData } from '@/src/schemas/produtoSchema';

const defaultValues: ProdutoFormData = {
  nome: '', fotoUri: '', categoriaId: '', quantidade: 0,
  quantidadeMinima: 0, preco: 0, unidade: 'un', observacao: '',
};

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { editarProduto, deletarProduto, getProdutoById } = useProducts();
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<ProdutoFormData>({ defaultValues, resolver: zodResolver(produtoSchema) });

  useEffect(() => {
    if (!id) return;
    const produto = getProdutoById(id);
    if (!produto) return;

    reset({
      nome: produto.nome,
      fotoUri: produto.foto ?? produto.fotoUri ?? '',
      categoriaId: produto.categoriaId,
      quantidade: produto.quantidade,
      quantidadeMinima: produto.quantidadeMinima,
      preco: produto.preco,
      unidade: produto.unidade as ProdutoFormData['unidade'],
      observacao: produto.observacao ?? '',
    });
  }, [getProdutoById, id, reset]);

  const handleUpdate = handleSubmit(async (data) => {
    if (!id) return;
    try {
      await editarProduto(id, data);
      router.replace('/produtos');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Nao foi possivel salvar o produto.');
    }
  });

  const performDelete = async () => {
    if (!id) return;
    try {
      await deletarProduto(id);
      router.replace('/produtos');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Nao foi possivel excluir o produto.');
    }
  };

  const confirmDelete = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm('Tem certeza que deseja excluir este produto?')) void performDelete();
      return;
    }
    Alert.alert('Excluir produto', 'Tem certeza que deseja excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void performDelete() },
    ]);
  };

  if (!id || !getProdutoById(id)) return null;

  return (
    <View style={[styles.container, { backgroundColor: palette.background }]}>
      <TouchableOpacity
        onPress={() => router.push(`/produtos/movimentacoes/${id}` as never)}
        style={[styles.movementButton, { backgroundColor: palette.tint }]}>
        <Text style={styles.movementButtonText}>Movimentar estoque e ver historico</Text>
      </TouchableOpacity>
      <ProdutoForm
        control={control}
        errors={errors}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdate}
        submitLabel="Salvar alteracoes"
        onDelete={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  movementButton: { alignItems: 'center', backgroundColor: '#F4A7D8', borderRadius: 8, margin: 16, marginBottom: 0, padding: 14 },
  movementButtonText: { color: '#FFFFFF', fontWeight: '700' },
});
