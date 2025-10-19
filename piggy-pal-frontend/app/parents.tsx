import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Parents() {
    return (
    <View style={s.screen}>
      {/* Title */}
      <Text style={s.title}>Add Chore</Text>

      {/* Example input fields */}
      <View style={s.inputGroup}>
        <Text style={s.label}>Chore</Text>
        <TextInput 
          style={s.input} 
          placeholder="e.g., Clean room" 
          placeholderTextColor="#A0AEC0"
        />
      </View>

      <View style={s.inputGroup}>
        <Text style={s.label}>Value</Text>
        <TextInput 
          style={s.input} 
          placeholder="e.g., 5.00" 
          placeholderTextColor="#A0AEC0"
          keyboardType="email-address"
        />
      </View>

      {/* Action button */}
      <Pressable style={s.button}>
        <Text style={s.buttonText}>Add Chore</Text>
      </Pressable>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#4A5568",
  },
  input: {
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CBD5E0",
  },
  button: {
    marginTop: "auto",
    marginBottom: 20,
    backgroundColor: "#0EA5E9",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  }
});