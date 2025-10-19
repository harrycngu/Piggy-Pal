// app/inventory.tsx
import React from "react";
import { View, Text, Image, Pressable, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { usePig } from "./state/PigStore";

export default function InventoryScreen() {
  const { owned, equipped, catalog, equip, unequip } = usePig();
  const router = useRouter();

  const ownedItems = catalog.filter((i) => owned.has(i.id));

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.title}>INVENTORY</Text>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back" style={s.backBtn}>
          <Text style={s.backText}>Back</Text>
        </Pressable>
      </View>

      <FlatList
        data={ownedItems}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
        ListEmptyComponent={
          <Text style={{ opacity: 0.6, marginTop: 12 }}>No items yet — visit the Shop!</Text>
        }
        renderItem={({ item }) => {
          const isEq = equipped.has(item.id);
          return (
            <View style={s.card}>
              {item.shopPreview ? (
                <Image source={item.shopPreview} style={s.icon} resizeMode="contain" />
              ) : (
                <View style={[s.icon, s.iconPlaceholder]} />
              )}

              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item.name}</Text>
                <Text style={s.status}>{isEq ? "Equipped" : "Unequipped"}</Text>
              </View>

              {!isEq ? (
                <Pressable
                  onPress={() => equip(item.id)}
                  style={[s.btn, s.btnPrimary]}
                  accessibilityLabel={`Equip ${item.name}`}
                >
                  <Text style={s.btnText}>Equip</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => unequip(item.id)}
                  style={[s.btn, s.btnAlt]}
                  accessibilityLabel={`Unequip ${item.name}`}
                >
                  <Text style={s.btnText}>Unequip</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F6FAFF", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700" },
  backBtn: { borderWidth: 3, borderColor: "#0F172A", paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#FFF" },
  backText: { fontWeight: "700" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 3,
    borderColor: "#0F172A",
    backgroundColor: "#FFFFFF",
    padding: 12,
  },
  icon: { width: 40, height: 40 },
  iconPlaceholder: { backgroundColor: "#EEF2FF", borderWidth: 1, borderColor: "#CBD5E1" },
  name: { fontSize: 14, fontWeight: "600" },
  status: { fontSize: 12, opacity: 0.7, marginTop: 2 },

  btn: { borderWidth: 3, borderColor: "#0F172A", paddingVertical: 8, paddingHorizontal: 12 },
  btnPrimary: { backgroundColor: "#C2F261" },
  btnAlt: { backgroundColor: "#FFD2A6" },
  btnText: { fontWeight: "700" },
});
