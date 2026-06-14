import {
  formatCurrency,
  calcularValorTotal,
  calcularEstoqueTotal,
  estoqueBaixo,
} from "../formatters";

// describe agrupa testes relacionados
describe("formatCurrency", () => {
  it("formata valor inteiro em Real brasileiro", () => {
    expect(formatCurrency(1500)).toBe("R$ 1.500,00");
  });

  it("formata valor com centavos", () => {
    expect(formatCurrency(29.99)).toBe("R$ 29,99");
  });

  it("formata zero", () => {
    expect(formatCurrency(0)).toBe("R$ 0,00");
  });
});

describe("calcularValorTotal", () => {
  it("multiplica quantidade por preço", () => {
    expect(calcularValorTotal(5, 10)).toBe(50);
  });

  it("retorna zero quando quantidade é zero", () => {
    expect(calcularValorTotal(0, 100)).toBe(0);
  });
});

describe("calcularEstoqueTotal", () => {
  it("soma o valor total de todos os produtos", () => {
    const produtos = [
      { quantidade: 10, preco: 5 },
      { quantidade: 2, preco: 50 },
    ];
    // (10 * 5) + (2 * 50) = 50 + 100 = 150
    expect(calcularEstoqueTotal(produtos)).toBe(150);
  });

  it("retorna zero para lista vazia", () => {
    expect(calcularEstoqueTotal([])).toBe(0);
  });
});

describe("estoqueBaixo", () => {
  it("retorna true quando quantidade é menor que o mínimo", () => {
    expect(estoqueBaixo(3, 5)).toBe(true);
  });

  it("retorna true quando quantidade é igual ao mínimo", () => {
    expect(estoqueBaixo(5, 5)).toBe(true);
  });

  it("retorna false quando quantidade está acima do mínimo", () => {
    expect(estoqueBaixo(10, 5)).toBe(false);
  });
});