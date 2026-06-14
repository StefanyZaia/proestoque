import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { theme } from "@/constants/theme";

export function LoadingView({ mensagem = "Carregando..." }: { mensagem?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  texto: { color: theme.colors.textLight, fontSize: 14 },
});
