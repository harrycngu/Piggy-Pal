import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function Chores() {
  const [chores, setChores] = useState<{
    id: string;
    childId: string;
    title: string;
    reward: number;
    completed: boolean;
    approved: boolean;
    dateCreated: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchChores = async () => {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:8787/chores/child1'); // replace 'child1' with dynamic ID if needed
          const data = await response.json();

          if (response.ok) {
            setChores(data);
          } else {
            console.error('Failed to fetch chores', data);
          }
        } catch (err) {
          console.error('Error fetching chores:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchChores();
    }, [])
  );

  if (loading) {
    return (
      <View style={s.screen}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.screen}>
      <Text style={s.title}>Your Chores</Text>
      {chores.length === 0 ? (
        <Text style={s.noChores}>No chores assigned</Text>
      ) : (
        chores.map((chore) => (
          <View key={chore.id} style={s.chore}>
            <Text style={s.choreText}>
              {chore.title} - ${chore.reward}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: "#D8EDFF",
    alignItems: "center",
    paddingVertical: 50,
  },
  title: {
    marginBottom: 20,
    fontSize: 35,
    fontWeight: "800",
    color: "#000",
  },
  chore: {
    width: '85%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  noChores: {
    fontSize: 16,
    color: "#4A5568",
    marginTop: 20,
  }
});
