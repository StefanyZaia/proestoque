import axios from "axios";
import { buscarProdutos, salvarProduto } from "../produtos";

// jest.mock substitui o módulo inteiro por uma versão mock
jest.mock("axios");

// Tipagem para o mock (TypeScript)
const axiosMock = axios as jest.Mocked<typeof axios>;

const mockProdutos = [
  { id: "1", nome: "Caneta Azul", quantidade: 20, preco: 2.5, estoqueMinimo: 5 },
  { id: "2", nome: "Caderno", quantidade: 5, preco: 20, estoqueMinimo: 3 },
];

describe("buscarProdutos", () => {
  // Limpa os mocks antes de cada teste para evitar interferência
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna lista de produtos da API", async () => {
    // Configura o mock para retornar os dados esperados
    axiosMock.get.mockResolvedValueOnce({ data: mockProdutos });

    const resultado = await buscarProdutos();

    expect(resultado).toEqual(mockProdutos);
    expect(axiosMock.get).toHaveBeenCalledWith("/produtos");
  });

  it("lança erro quando a API falha", async () => {
    // Simula uma falha de rede
    axiosMock.get.mockRejectedValueOnce(new Error("Network Error"));

    // Verifica que a função propaga o erro corretamente
    await expect(buscarProdutos()).rejects.toThrow("Network Error");
  });
});

describe("salvarProduto", () => {
  it("envia o produto para a API via POST", async () => {
    const novoProduto = { nome: "Borracha", quantidade: 10, preco: 1.5, estoqueMinimo: 5 };
    const produtoCriado = { id: "3", ...novoProduto };

    axiosMock.post.mockResolvedValueOnce({ data: produtoCriado });

    const resultado = await salvarProduto(novoProduto);

    expect(resultado).toEqual(produtoCriado);
    expect(axiosMock.post).toHaveBeenCalledWith("/produtos", novoProduto);
  });
});