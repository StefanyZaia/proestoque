import { View, StyleSheet } from "react-native";
import { Skeleton } from "./Skeleton";

export function ProdutoSkeletonItem() {
  return (
    <View style={styles.item}>
      <Skeleton width={40} height={40} borderRadius={10} />
      <View style={styles.info}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="35%" height={11} style={{ marginTop: 6 }} />
      </View>
      <Skeleton width={50} height={22} borderRadius={999} />
    </View>
  );
}

// Gera N itens de skeleton — simula a lista antes dos dados chegarem
export function ProdutoListaSkeleton({ count = 6 }: { count?: number }) {
  return <>{Array.from({ length: count }).map((_, i) => <ProdutoSkeletonItem key={i} />)}</>;
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, marginBottom: 8 },
  info: { flex: 1, gap: 4 },
});
