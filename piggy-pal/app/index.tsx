import { View, Text, Pressable, SafeAreaView, StyleSheet, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Home() {
  return (
    <SafeAreaView style={s.screen}>
      {/* Title */}
      <Text style={s.title}>PiggyPal</Text>

      {/* Pig area (placeholder) */}
      <View style={s.pigWrap}>
        {/* shadow ellipse */}
        <View style={s.pigShadow} />
        {/* pig body placeholder, swap with SVG/Lottie later */}
        <View style={s.pigBody}>
          <View style={s.pigEyeLeft}/>
          <View style={s.pigEyeRight}/>
          <View style={s.pigSnout}/>
        </View>
      </View>

      {/* Balance */}
      <Text style={s.balance}>Balance: $5</Text>

      {/* Bottom Nav */}
      <View style={s.nav}>
        <NavItem
          label="Home"
          active
          icon={<Ionicons name="home" size={22} color="#236BE8" />}
        />
        <NavItem
          label="Chores"
          icon={<MaterialCommunityIcons name="clipboard-list-outline" size={22} color="#000" />}
        />
        <NavItem
          label="Your Pig"
          icon={<MaterialCommunityIcons name="pig-variant-outline" size={22} color="#000" />}
        />
        <NavItem
          label="Parents"
          icon={<Ionicons name="person-circle-outline" size={22} color="#000" />}
        />
      </View>
    </SafeAreaView>
  );
}

function NavItem({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.navItem}>
      <View style={s.iconWrap}>{icon}</View>
      <Text style={[s.navLabel, active && { color: "#236BE8" }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#D8EDFF", // your Figma bg
    alignItems: "center",
  },
  title: {
    marginTop: 24,
    fontSize: 48, // Figma said 70px; mobile-friendly scale
    fontWeight: "800",
    color: "#000",
  },
  pigWrap: {
    marginTop: 24,
    width: 220,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  pigShadow: {
    position: "absolute",
    bottom: 0,
    width: 150,
    height: 25,
    borderRadius: 13,
    backgroundColor: "rgba(188,182,182,0.54)",
  },
  pigBody: {
    width: 160,
    height: 130,
    backgroundColor: "#FFCBEC",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EBA4D1",
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  pigEyeLeft: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#000",
    left: 50,
    top: 42,
  },
  pigEyeRight: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#000",
    left: 80,
    top: 47,
  },
  pigSnout: {
    position: "absolute",
    width: 40,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFCBEC",
    borderColor: "#000",
    borderWidth: 1,
    top: 70,
  },
  balance: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  nav: {
    position: "absolute",
    bottom: 18,
    left: 14,
    right: 14,
    height: 56,
    borderRadius: 23,
    backgroundColor: "#C3D9FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  iconWrap: { marginBottom: 2 },
  navLabel: { fontSize: 12, color: "#000" },
});
