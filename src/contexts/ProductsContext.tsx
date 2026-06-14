import { AxiosError } from 'axios';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { ProdutoFormData } from '@/src/schemas/produtoSchema';
import { api } from '@/src/services/api';
import type { Movimentacao, Produto } from '@/src/types/estoque';
import { useAuth } from '@/src/contexts/AuthContext';

type MovimentoInput = {
  tipo: 'entrada' | 'saida';
  quantidade: number;
  observacao?: string;
};

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<Produto>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<Produto>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
  movimentarProduto: (id: string, data: MovimentoInput) => Promise<Movimentacao>;
  carregarMovimentacoes: (id: string) => Promise<Movimentacao[]>;
};

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message ?? (error.response ? 'Nao foi possivel concluir a operacao.' : 'Sem conexao com a API.');
  }

  return 'Ocorreu um erro inesperado.';
}

function toApiPayload(data: ProdutoFormData) {
  const { fotoUri, ...rest } = data;
  return { ...rest, foto: fotoUri || null };
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarProdutos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<Produto[]>('/produtos');
      setProdutos(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isBootstrapping) return;

    if (isAuthenticated) {
      void carregarProdutos();
      return;
    }

    setProdutos([]);
    setError(null);
    setIsLoading(false);
  }, [carregarProdutos, isAuthenticated, isBootstrapping]);

  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const response = await api.post<Produto>('/produtos', toApiPayload(data));
    setProdutos((current) => [response.data, ...current]);
    return response.data;
  }, []);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const response = await api.put<Produto>(`/produtos/${id}`, toApiPayload(data));
    setProdutos((current) => current.map((item) => (item.id === id ? response.data : item)));
    return response.data;
  }, []);

  const deletarProduto = useCallback(async (id: string) => {
    await api.delete(`/produtos/${id}`);
    setProdutos((current) => current.filter((item) => item.id !== id));
  }, []);

  const movimentarProduto = useCallback(async (id: string, input: MovimentoInput) => {
    const response = await api.post<{ produto: Produto; movimentacao: Movimentacao }>(
      `/produtos/${id}/movimentacao`,
      input
    );
    setProdutos((current) =>
      current.map((item) => (item.id === id ? response.data.produto : item))
    );
    return response.data.movimentacao;
  }, []);

  const carregarMovimentacoes = useCallback(async (id: string) => {
    const response = await api.get<Movimentacao[]>(`/produtos/${id}/movimentacoes`);
    return response.data;
  }, []);

  const getProdutoById = useCallback(
    (id: string) => produtos.find((produto) => produto.id === id),
    [produtos]
  );

  const value = useMemo(
    () => ({
      produtos,
      isLoading,
      error,
      carregarProdutos,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
      movimentarProduto,
      carregarMovimentacoes,
    }),
    [produtos, isLoading, error, carregarProdutos, adicionarProduto, editarProduto, deletarProduto, getProdutoById, movimentarProduto, carregarMovimentacoes]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts deve ser usado dentro de ProductsProvider');
  return context;
}
