import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PiggyPal</Text>
      <Image source={require('../assets/images/piggy-bank.png')} />
      <Text style={styles.balance}>Balance: $25.00</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8EDFF',
  },
  title: {
    marginTop: 24,
    fontSize: 48,
    fontWeight: '800',
    color: '#000',
    marginBottom: 20,
  },
  balance: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
});
