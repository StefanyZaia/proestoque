import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { PRODUTOS_MOCK, type Produto } from "../data/mockData";
import type { ProdutoFormData } from "../schemas/produtoSchema";

// ── Tipos ────────────────────────────────────────────────────
type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
};

type ProductsAction =
  | { type: "LOAD"; payload: Produto[] }
  | { type: "ADD"; payload: Produto }
  | { type: "UPDATE"; payload: Produto }
  | { type: "DELETE"; payload: string }; // string = id do produto

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

// ── Chave do AsyncStorage ────────────────────────────────────
const STORAGE_KEY = "@proestoque:produtos";

// ── Reducer ─────────────────────────────────────────────────
// Função PURA: recebe estado atual + ação, retorna NOVO estado
// Nunca modifica o estado diretamente (imutabilidade)
function produtosReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "LOAD":
      return { ...state, produtos: action.payload, isLoading: false };

    case "ADD":
      return { ...state, produtos: [action.payload, ...state.produtos] };

    case "UPDATE":
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case "DELETE":
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== action.payload),
      };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────
const ProductsContext = createContext<ProductsContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    isLoading: true,
  });

  // Carrega produtos do AsyncStorage na inicialização
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        // Se houver dados salvos, usa eles; senão, usa o mock inicial
        const produtos = json ? JSON.parse(json) : PRODUTOS_MOCK;
        dispatch({ type: "LOAD", payload: produtos });
      } catch {
        dispatch({ type: "LOAD", payload: PRODUTOS_MOCK });
      }
    }
    carregarProdutos();
  }, []);

  // Helper: persiste os produtos toda vez que o estado muda
  const persistir = useCallback(async (produtos: Produto[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  }, []);

  // ── CRUD ─────────────────────────────────────────────────
  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const novoProduto: Produto = {
      ...data,
      id: "prod_" + Date.now(),
      fotoUri: data.fotoUri ?? "",
      ultimaMovimentacao: new Date().toISOString(),
      observacao: data.observacao ?? "",
    };
    dispatch({ type: "ADD", payload: novoProduto });
    // Persiste a nova lista (state.produtos ainda não tem o novo item aqui,
    // então construímos a lista manualmente)
    await persistir([novoProduto, ...state.produtos]);
  }, [state.produtos, persistir]);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const produtoAtualizado: Produto = {
      ...data,
      id,
      fotoUri: data.fotoUri ?? "",
      ultimaMovimentacao: new Date().toISOString(),
      observacao: data.observacao ?? "",
    };
    dispatch({ type: "UPDATE", payload: produtoAtualizado });
    await persistir(
      state.produtos.map((p) => (p.id === id ? produtoAtualizado : p))
    );
  }, [state.produtos, persistir]);

  const deletarProduto = useCallback(async (id: string) => {
    dispatch({ type: "DELETE", payload: id });
    await persistir(state.produtos.filter((p) => p.id !== id));
  }, [state.produtos, persistir]);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((p) => p.id === id),
    [state.produtos]
  );

  return (
    <ProductsContext.Provider value={{
      produtos: state.produtos,
      isLoading: state.isLoading,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

// ── Hook customizado ─────────────────────────────────────────
export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  return context;
}
