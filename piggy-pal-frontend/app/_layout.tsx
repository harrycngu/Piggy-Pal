import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
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
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="clipboard-list-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pig"
        options={{
          title: "Your Pig",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="pig-variant-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="parents"
        options={{
          title: "Parents",
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
