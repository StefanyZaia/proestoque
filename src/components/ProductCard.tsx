import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  estoqueMinimo: number;
}

interface Props {
  produto: Produto;
  onEditar: (id: string) => void;
}

export function ProductCard({ produto, onEditar }: Props) {
  const estoqueBaixo = produto.quantidade <= produto.estoqueMinimo;

  return (
    <View style={styles.card} testID="product-card">
      <Text style={styles.nome}>{produto.nome}</Text>
      <Text style={styles.quantidade}>
        Estoque: {produto.quantidade} unidades
      </Text>
      {estoqueBaixo && (
        <Text style={styles.alerta} testID="alerta-estoque">
          ⚠️ Estoque baixo
        </Text>
      )}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => onEditar(produto.id)}
        accessibilityLabel="Editar produto"
      >
        <Text style={styles.botaoTexto}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: "#fff", borderRadius: 12, marginBottom: 8 },
  nome: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  quantidade: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  alerta: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  botao: { marginTop: 12, backgroundColor: "#7c3aed", padding: 8, borderRadius: 8, alignItems: "center" },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
});