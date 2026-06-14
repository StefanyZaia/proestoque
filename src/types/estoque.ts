export type Categoria = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  _count?: { produtos: number };
};

export type Produto = {
  id: string;
  nome: string;
  foto?: string | null;
  fotoUri?: string;
  categoriaId: string;
  categoria?: Categoria;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao?: string | null;
  ultimaMovimentacao: string;
  criadoEm?: string;
  atualizadoEm?: string;
};

export type Movimentacao = {
  id: string;
  produtoId: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: string;
  observacao?: string | null;
};
