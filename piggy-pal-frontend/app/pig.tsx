import { useEffect, useRef, useState } from "react";
import { View, Text, Image, ImageBackground, Pressable, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePig } from "./state/PigStore";
import type { ItemId } from "./state/PigStore";


const MName = (null as unknown) as React.ComponentProps<typeof MaterialCommunityIcons>["name"];
const PIG_1  = require("../assets/images/pigEyesOpen.png");
const PIG_2  = require("../assets/images/pigEyesClosed.png");
const PIG_PANTS = require("../assets/images/pigPantsEquipped.png"); 
const PIG_BOWTIE = require("../assets/images/pigbowTieEquipped.png");
const BG_ROOM = require("../assets/images/pixelBedroom.png");
const PIG_GLASSES = require("../assets/images/pigGlassesEquipped.png");


export default function PigScreen() {
  const router = useRouter();
  const { tokens, equipped, earnTokens } = usePig();

  // blink
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f === 0 ? 1 : 0)), 1200);
    return () => clearInterval(t);
  }, []);

  // bob
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -4, duration: 700, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0,  duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [bob]);

  // stats
  const [hunger, setHunger] = useState(70);
  const [clean,  setClean ] = useState(70);
  const [energy, setEnergy] = useState(70);
  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const equippedId =
  (equipped.values().next().value as ItemId | undefined) || undefined;

  const pigSprite =
    equippedId === "pants"   ? PIG_PANTS :
    equippedId === "bowTie"  ? PIG_BOWTIE :
    equippedId === "glasses" ? PIG_GLASSES :
    (frame === 0 ? PIG_1 : PIG_2);

  return (
    <ImageBackground source={BG_ROOM} style={s.bg} resizeMode="cover">
      {/* Top bar: coins + icons */}
      <View style={s.topBar}>
        <View style={s.coinPill}>
          <MaterialCommunityIcons name={"currency-usd-circle" as typeof MName} size={18} />
          <Text style={s.coinText}>{tokens}</Text>
        </View>

        <View style={s.topIcons}>
          <Pressable onPress={() => router.push("/inventory")} style={s.iconBtn} accessibilityLabel="Open inventory">
            <Ionicons name="briefcase" size={22} />
          </Pressable>
          <Pressable onPress={() => router.push("/shop")} style={s.iconBtn} accessibilityLabel="Open shop">
            <Ionicons name="cart" size={22} />
          </Pressable>
        </View>
      </View>

      <Text style={s.title}>YOUR PIG</Text>

      <View style={s.panel}>
        <Stat label="HUNGER" value={hunger} bar="#FF7BA3" />
        <View style={s.sp8} />
        <Stat label="CLEAN"  value={clean}  bar="#7BD0FF" />
        <View style={s.sp8} />
        <Stat label="ENERGY" value={energy} bar="#C2F261" />
      </View>

      {/* Grounded pig area */}
      <View style={s.room}>
        <Animated.View style={[s.pigGroup, { transform: [{ translateY: bob }] }]}>
          <Image source={pigSprite} style={s.pig} resizeMode="contain" />
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={s.actionsRow}>
        <PixelButton label="FEED"  onPress={() => { setHunger(v => clamp(v + 18)); earnTokens(1); }} color="#FF7BA3" />
        <View style={s.sp10} />
        <PixelButton label="WASH"  onPress={() => { setClean (v => clamp(v + 18)); earnTokens(1); }} color="#7BD0FF" />
        <View style={s.sp10} />
        <PixelButton label="SLEEP" onPress={() => { setEnergy(v => clamp(v + 22)); earnTokens(1); }} color="#C2F261" />
      </View>

      <Text style={s.hint}>EARN 🪙 BY FINISHING CHORES!</Text>
    </ImageBackground>
  );
}

function Stat({ label, value, bar }: { label: string; value: number; bar: string }) {
  return (
    <View>
      <Text style={s.statLabel}>{label}</Text>
      <View style={s.barBg}>
        <View style={[s.barFill, { width: `${Math.max(2, value)}%`, backgroundColor: bar }]} />
      </View>
      <Text style={s.statVal}>{value}%</Text>
    </View>
  );
}

function PixelButton({ label, onPress, color }: { label: string; onPress: () => void; color: string }) {
  return (
    <Pressable onPress={onPress} style={[s.btn, { backgroundColor: color }]}>
      <View style={s.btnInner}>
        <Text style={s.btnText}>{label}</Text>
      </View>
    </Pressable>
  );
}

const PX = { dark: "#0F172A", panel: "#E9F2FF" };

const s = StyleSheet.create({
  bg: { flex: 1, alignItems: "center", paddingTop: 8 },

  topBar: {
    width: "100%",
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  coinPill: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 3, borderColor: PX.dark,
    paddingVertical: 6, paddingHorizontal: 10,
  },
  coinText: { fontSize: 12, color: PX.dark },

  topIcons: { flexDirection: "row", gap: 10 },
  iconBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 3, borderColor: PX.dark,
    padding: 6,
  },

  title: { fontSize: 14, color: PX.dark, marginVertical: 8 },

  panel: {
    width: 320, backgroundColor: PX.panel,
    borderWidth: 4, borderColor: PX.dark, padding: 10,
  },
  statLabel: { fontSize: 10, color: PX.dark, marginBottom: 4 },
  barBg: { height: 12, borderWidth: 3, borderColor: PX.dark, backgroundColor: "#FFF" },
  barFill: { height: "100%" },
  statVal: { marginTop: 4, fontSize: 10, color: PX.dark },

  sp8: { height: 8 }, sp10:{ width: 10 },

  room: { flex: 1, width: "100%", alignItems: "center", justifyContent: "flex-end" },
  pigGroup: { alignItems: "center", marginBottom: -350 },
  pig: { width: 1000, height: 1000 },

  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 6 },
  btn: { borderWidth: 4, borderColor: PX.dark, padding: 0 },
  btnInner: { paddingVertical: 10, paddingHorizontal: 12, borderWidth: 4, borderColor: "#FFFFFF" },
  btnText: { fontSize: 10, color: PX.dark },
  hint: { marginBottom: 12, fontSize: 9, color: PX.dark },
});

