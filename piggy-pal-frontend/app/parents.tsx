import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";

export default function Parents() {
  const [chore, setChore] = useState("");
  const [value, setValue] = useState("");

const handleAddChore = async () => {
  if (!chore || !value) {
    console.log("Error: Please fill out both fields");
    return;
  }

  try {
    const response = await fetch("http://localhost:8787/chores/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: "child1",
        title: chore,
        reward: Number(value),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`Success: Chore "${data.title}" added!`);
      setChore("");
      setValue("");
    } else {
      console.error(`Error: ${data.message || "Failed to add chore"}`);
    }
  } catch (err) {
    console.error("Failed to add chore, check backend connection:", err);
  }
};


  return (
    <View style={s.screen}>
      <Text style={s.title}>Add Chore</Text>

      <View style={s.inputGroup}>
        <Text style={s.label}>Chore</Text>
        <TextInput
          style={s.input}
          placeholder="e.g., Clean room"
          placeholderTextColor="#A0AEC0"
          value={chore}
          onChangeText={setChore}
        />
      </View>

      <View style={s.inputGroup}>
        <Text style={s.label}>Value</Text>
        <TextInput
          style={s.input}
          placeholder="e.g., 5"
          placeholderTextColor="#A0AEC0"
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
        />
      </View>

      <Pressable style={s.button} onPress={handleAddChore}>
        <Text style={s.buttonText}>Add Chore</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#D8EDFF",
    alignItems: "center",
  },
  title: {
    marginTop: 70,
    marginBottom: 20,
    fontSize: 35,
    fontWeight: "800",
    color: "#000",
  },
  inputGroup: {
    marginBottom: 20,
    width: "80%",
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
  },
});
