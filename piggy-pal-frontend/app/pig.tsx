// app/pig.tsx
import { useEffect, useRef, useState } from "react";
import { View, Text, Image, ImageBackground, Pressable, StyleSheet, Animated } from "react-native";

// assets (update paths if yours differ)
const PIG_1 = require("../assets/images/pigEyesOpen.png");
const PIG_2 = require("../assets/images/pigEyesClosed.png");
const BG_ROOM = require("../assets/images/pixelBedroom.png");

export default function PigScreen() {
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

  return (
    <ImageBackground source={BG_ROOM} style={s.bg} resizeMode="cover">
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
          <Image
            source={frame === 0 ? PIG_1 : PIG_2}
            style={s.pig}
            resizeMode="contain"   
          />
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={s.actionsRow}>
        <PixelButton label="FEED"  onPress={() => setHunger(v => clamp(v + 18))} color="#FF7BA3" />
        <View style={s.sp10} />
        <PixelButton label="WASH"  onPress={() => setClean (v => clamp(v + 18))} color="#7BD0FF" />
        <View style={s.sp10} />
        <PixelButton label="SLEEP" onPress={() => setEnergy(v => clamp(v + 22))} color="#C2F261" />
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

const PX = {
  dark:  "#0F172A",
  panel: "#E9F2FF",
};

const s = StyleSheet.create({
  bg: { flex: 1, alignItems: "center", paddingTop: 16 },
  title: {
    // fontFamily: "PressStart2P_400Regular", // uncomment if you've loaded it
    fontSize: 14,
    color: PX.dark,
    marginBottom: 8,
  },

  panel: {
    width: 320,
    backgroundColor: PX.panel,
    borderWidth: 4,
    borderColor: PX.dark,
    padding: 10,
  },
  statLabel: {
    // fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    color: PX.dark,
    marginBottom: 4,
  },
  barBg: {
    height: 12,
    borderWidth: 3,
    borderColor: PX.dark,
    backgroundColor: "#FFFFFF",
  },
  barFill: { height: "100%" },
  statVal: {
    marginTop: 4,
    // fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    color: PX.dark,
  },

  // spacing helpers
  sp8: { height: 8 },
  sp10:{ width: 10 },

  room: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pigGroup: {
    alignItems: "center",
    marginBottom: -350, 
  },
  pig: {
    width: 1000,     // scale by an integer for crisp pixels
    height: 1000,
  },
  shadow: {
    width: 140,
    height: 16,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: -8,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  btn: { borderWidth: 4, borderColor: PX.dark, padding: 0 },
  btnInner: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#FFFFFF",
  },
  btnText: {
    // fontFamily: "PressStart2P_400Regular",
    fontSize: 10,
    color: PX.dark,
  },

  hint: {
    marginBottom: 12,
    // fontFamily: "PressStart2P_400Regular",
    fontSize: 9,
    color: PX.dark,
  },
});
