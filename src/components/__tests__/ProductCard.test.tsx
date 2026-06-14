import { render, screen, fireEvent } from "@testing-library/react-native";
import { ProductCard } from "../ProductCard";

// Dados de teste reutilizáveis
const mockProduto = {
  id: "1",
  nome: "Caneta Azul",
  quantidade: 20,
  preco: 2.5,
  estoqueMinimo: 5,
};

const mockProdutoBaixoEstoque = {
  ...mockProduto,
  quantidade: 3, // abaixo do mínimo de 5
};

describe("ProductCard", () => {
  it("renderiza o nome do produto", () => {
    render(<ProductCard produto={mockProduto} onEditar={jest.fn()} />);

    // getByText encontra o elemento pelo texto visível
    expect(screen.getByText("Caneta Azul")).toBeTruthy();
  });

  it("exibe a quantidade em estoque", () => {
    render(<ProductCard produto={mockProduto} onEditar={jest.fn()} />);

    expect(screen.getByText("Estoque: 20 unidades")).toBeTruthy();
  });

  it("não exibe alerta quando estoque está normal", () => {
    render(<ProductCard produto={mockProduto} onEditar={jest.fn()} />);

    // queryByTestId retorna null se o elemento não existir (não lança erro)
    expect(screen.queryByTestId("alerta-estoque")).toBeNull();
  });

  it("exibe alerta quando estoque está baixo", () => {
    render(
      <ProductCard produto={mockProdutoBaixoEstoque} onEditar={jest.fn()} />
    );

    expect(screen.getByTestId("alerta-estoque")).toBeTruthy();
    expect(screen.getByText("⚠️ Estoque baixo")).toBeTruthy();
  });

  it("chama onEditar com o id correto ao pressionar o botão", () => {
    // jest.fn() cria uma função mock que registra suas chamadas
    const onEditarMock = jest.fn();

    render(
      <ProductCard produto={mockProduto} onEditar={onEditarMock} />
    );

    // fireEvent.press simula o toque do usuário
    fireEvent.press(screen.getByText("Editar"));

    // Verifica que a função foi chamada com o id do produto
    expect(onEditarMock).toHaveBeenCalledTimes(1);
    expect(onEditarMock).toHaveBeenCalledWith("1");
  });
});