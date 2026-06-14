export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function calcularValorTotal(
  quantidade: number,
  preco: number
): number {
  return quantidade * preco;
}

export function calcularEstoqueTotal(
  produtos: { quantidade: number; preco: number }[]
): number {
  return produtos.reduce(
    (acc, p) => acc + calcularValorTotal(p.quantidade, p.preco),
    0
  );
}

export function estoqueBaixo(quantidade: number, minimo: number): boolean {
  return quantidade <= minimo;
}