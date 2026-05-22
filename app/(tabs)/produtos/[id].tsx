import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useForm } from 'react-hook-form';

import ProdutoForm from '@/scr/components/produtos/ProdutoForm';
import { useProducts } from '@/scr/contexts/ProductsContext';
import { produtoSchema, type ProdutoFormData } from '@/scr/schemas/produtoSchema';

const defaultValues: ProdutoFormData = {
  nome: '',
  fotoUri: '',
  categoriaId: '',
  quantidade: 0,
  quantidadeMinima: 0,
  preco: 0,
  unidade: 'un',
  observacao: '',
};

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { editarProduto, deletarProduto, getProdutoById } = useProducts();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    defaultValues,
    resolver: zodResolver(produtoSchema),
  });

  useEffect(() => {
    if (!id) {
      return;
    }

    const produto = getProdutoById(id);

    if (!produto) {
      router.replace('/produtos');
      return;
    }

    reset({
      nome: produto.nome,
      fotoUri: produto.fotoUri ?? '',
      categoriaId: produto.categoriaId,
      quantidade: produto.quantidade,
      quantidadeMinima: produto.quantidadeMinima,
      preco: produto.preco,
      unidade: produto.unidade as ProdutoFormData['unidade'],
      observacao: produto.observacao ?? '',
    });
  }, [getProdutoById, id, reset, router]);

  const handleUpdate = handleSubmit(async (data) => {
    if (!id) {
      return;
    }

    await editarProduto(id, data);
    router.replace('/produtos');
  });

  const confirmDelete = () => {
    if (!id) {
      return;
    }

    const performDelete = async () => {
      await deletarProduto(id);
      router.replace('/produtos');
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm('Tem certeza que deseja excluir este produto?')) {
        void performDelete();
      }
      return;
    }

    Alert.alert('Excluir produto', 'Tem certeza que deseja excluir este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          void performDelete();
        },
      },
    ]);
  };

  return (
    <ProdutoForm
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleUpdate}
      submitLabel="Salvar alterações"
      onDelete={confirmDelete}
    />
  );
}
