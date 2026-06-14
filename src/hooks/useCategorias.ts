import { useCallback, useEffect, useState } from 'react';

import { api } from '@/src/services/api';
import type { Categoria } from '@/src/types/estoque';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<Categoria[]>('/categorias');
      setCategorias(data);
    } catch {
      setError('Nao foi possivel carregar as categorias.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarCategorias();
  }, [carregarCategorias]);

  return { categorias, isLoading, error, carregarCategorias };
}
