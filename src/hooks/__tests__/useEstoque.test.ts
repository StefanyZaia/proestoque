import { renderHook } from "@testing-library/react-native";
import { useEstoque } from "../useEstoque";

const produtos = [
  { id: "1", nome: "Caneta", quantidade: 3, preco: 2.5, estoqueMinimo: 5 },
  { id: "2", nome: "Caderno", quantidade: 10, preco: 20, estoqueMinimo: 3 },
  { id: "3", nome: "Borracha", quantidade: 2, preco: 1.5, estoqueMinimo: 5 },
];

describe("useEstoque", () => {
  it("calcula o valor total do estoque corretamente", () => {
    const { result } = renderHook(() => useEstoque(produtos));

    // Caneta: 3 * 2.5 = 7.5 | Caderno: 10 * 20 = 200 | Borracha: 2 * 1.5 = 3
    // Total: 210.5
    expect(result.current.valorTotal).toBe(210.5);
  });

  it("identifica corretamente os produtos com estoque baixo", () => {
    const { result } = renderHook(() => useEstoque(produtos));

    // Caneta (3 <= 5) e Borracha (2 <= 5) estão abaixo do mínimo
    expect(result.current.produtosBaixoEstoque).toHaveLength(2);
    expect(result.current.produtosBaixoEstoque[0].nome).toBe("Caneta");
    expect(result.current.produtosBaixoEstoque[1].nome).toBe("Borracha");
  });

  it("calcula o total de itens no estoque", () => {
    const { result } = renderHook(() => useEstoque(produtos));

    // 3 + 10 + 2 = 15
    expect(result.current.totalItens).toBe(15);
  });

  it("retorna zeros para lista vazia", () => {
    const { result } = renderHook(() => useEstoque([]));

    expect(result.current.valorTotal).toBe(0);
    expect(result.current.produtosBaixoEstoque).toHaveLength(0);
    expect(result.current.totalItens).toBe(0);
  });
});