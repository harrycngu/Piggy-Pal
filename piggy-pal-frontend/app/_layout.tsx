// app/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { PigProvider } from "./state/PigStore"

export default function Layout() {
  return (
    <PigProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: { height: 56, borderTopWidth: 0, backgroundColor: "#C3D9FF" },
          tabBarActiveTintColor: "#236BE8",
          tabBarInactiveTintColor: "#000",
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chores"
          options={{
            title: "Chores",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="clipboard-list-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pig"
          options={{
            title: "Your Pig",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="pig-variant-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="parents"
          options={{
            title: "Parents",
            tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={22} color={color} />,
          }}
        />

        {/* Hidden routes: reachable via router.push("/shop") and router.push("/inventory"),
           but not shown in the tab bar. Keep them in /app/shop.tsx and /app/inventory.tsx */}
        <Tabs.Screen
          name="shop"
          options={{
            href: null,            // hide from tabs
            headerShown: true,     // show a header on this screen if you navigate here
            title: "Shop",
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            href: null,            // hide from tabs
            headerShown: true,
            title: "Inventory",
          }}
        />
      </Tabs>
    </PigProvider>
  );
}
