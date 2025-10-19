import { View, Text, Image, Pressable, StyleSheet, FlatList } from "react-native";
import { usePig } from "./state/PigStore";
import { useRouter } from "expo-router";

export default function ShopScreen() {
  const { tokens, owned, equipped, catalog, buy, equip } = usePig();
  const router = useRouter();

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.title}>SHOP</Text>
        <Text style={s.tokens}>🪙 {tokens}</Text>
      </View>

      <FlatList
        data={catalog}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const has = owned.has(item.id);
          const isEq = equipped.has(item.id);
          const canBuy = tokens >= item.price;

          return (
            <View style={s.card}>
              {item.shopPreview && <Image source={item.shopPreview} style={s.icon} />}
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.price}>Price: {item.price} 🪙</Text>
                <Text style={s.status}>{has ? (isEq ? "Equipped" : "Owned") : "Not owned"}</Text>
              </View>

              {!has ? (
                <Pressable
                  disabled={!canBuy}
                  onPress={() => buy(item.id)}
                  style={[s.btn, !canBuy && s.btnDisabled]}
                >
                  <Text style={s.btnText}>{canBuy ? "Buy" : "Need coins"}</Text>
                </Pressable>
              ) : !isEq ? (
                <Pressable onPress={() => equip(item.id)} style={s.btn}>
                  <Text style={s.btnText}>Equip</Text>
                </Pressable>
              ) : (
                <View style={[s.btn, s.btnGhost]}>
                  <Text style={s.btnGhostText}>Equipped</Text>
                </View>
              )}
            </View>
          );
        }}
      />

      <Pressable onPress={() => router.back()} style={s.backBtn}>
        <Text style={s.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, gap: 12, backgroundColor: "#F6FAFF" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700" },
  tokens: { fontSize: 16 },
  card: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 3, borderColor: "#0F172A", backgroundColor: "#FFFFFF", padding: 12,
  },
  icon: { width: 40, height: 40, resizeMode: "contain" },
  name: { fontSize: 14, fontWeight: "600" },
  price:{ fontSize: 12, opacity: 0.8 },
  status:{ fontSize: 12, opacity: 0.7, marginTop: 2 },
  btn: {
    borderWidth: 3, borderColor: "#0F172A", paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#C2F261",
  },
  btnText: { fontWeight: "700" },
  btnDisabled: { backgroundColor: "#E5E7EB" },
  btnGhost: { backgroundColor: "#FFFFFF" },
  btnGhostText: { fontWeight: "700", opacity: 0.6 },
  backBtn: { alignSelf: "center", marginTop: 8, borderWidth: 3, borderColor: "#0F172A", padding: 10, backgroundColor: "#FFF" },
  backText:{ fontWeight: "700" },
});
