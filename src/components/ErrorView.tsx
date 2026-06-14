import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

interface ErrorViewProps {
  mensagem: string;
  onRetry?: () => void;
}

export function ErrorView({ mensagem, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={theme.colors.textLight} />
      <Text style={styles.titulo}>Algo deu errado</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.botao} onPress={onRetry}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  titulo: { fontSize: 18, fontWeight: "600", color: theme.colors.text },
  mensagem: { fontSize: 14, color: theme.colors.textLight, textAlign: "center" },
  botao: { backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  botaoTexto: { color: "#fff", fontWeight: "600" },
});
