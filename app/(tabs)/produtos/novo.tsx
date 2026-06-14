import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';

import ProdutoForm from '@/src/components/produtos/ProdutoForm';
import { useProducts } from '@/src/contexts/ProductsContext';
import { produtoSchema, type ProdutoFormData } from '@/src/schemas/produtoSchema';

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

export default function NovoProdutoScreen() {
  const router = useRouter();
  const { adicionarProduto } = useProducts();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    defaultValues,
    resolver: zodResolver(produtoSchema),
  });

  const handleCreate = handleSubmit(async (data) => {
    try {
      await adicionarProduto(data);
      router.replace('/produtos');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Nao foi possivel cadastrar o produto.');
    }
  });

  return (
    <ProdutoForm
      control={control}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleCreate}
      submitLabel="Cadastrar produto"
    />
  );
}
