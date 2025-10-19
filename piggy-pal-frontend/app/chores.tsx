import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Chores() {
    return (
        <View style={s.screen}>
            <Text style={s.title}>Your Chores</Text>
            <View style={s.chore}>
                <Text style={s.choreText}>Clean Room - $5</Text>
            </View>
            <View style={s.chore}>
                <Text style={s.choreText}>Wash Dishes - $3</Text>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#D8EDFF", // your Figma bg
    alignItems: "center",
  },
  title: {
    marginTop: 70,
    marginBottom: 20,
    fontSize: 35, // Figma said 70px; mobile-friendly scale
    fontWeight: "800",
    color: "#000",
  },
  chore: {
        width: '85%', // Adjusted width to look better on a screen
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 50, // High border radius for pill shape
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        // Common shadow for a raised effect
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        backgroundColor: "#C7C8CA"
    },
    choreText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "700",
    }
});