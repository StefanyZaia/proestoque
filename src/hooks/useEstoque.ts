import { useMemo } from "react";
import { calcularEstoqueTotal, estoqueBaixo } from "../utils/formatters";

interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  estoqueMinimo: number;
}

export function useEstoque(produtos: Produto[]) {
  const valorTotal = useMemo(
    () => calcularEstoqueTotal(produtos),
    [produtos]
  );

  const produtosBaixoEstoque = useMemo(
    () => produtos.filter((p) => estoqueBaixo(p.quantidade, p.estoqueMinimo)),
    [produtos]
  );

  const totalItens = useMemo(
    () => produtos.reduce((acc, p) => acc + p.quantidade, 0),
    [produtos]
  );

  return { valorTotal, produtosBaixoEstoque, totalItens };
}