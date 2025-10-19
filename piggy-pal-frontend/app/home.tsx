import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default function Home() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Change this to your backend URL (Cloudflare Worker)
  const API_BASE = "http://localhost:8787"; // or your deployed URL

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${API_BASE}/children`);
        const data = await res.json();

        // Currently only gets the first childs data from list
        if (Array.isArray(data) && data.length > 0) {
          setBalance(data[0].balance);
        } else {
          console.warn("No child data found");
        }
      } catch (err) {
        console.error("Error fetching balance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#236BE8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PiggyPal</Text>

      <Image source={require('../assets/images/piggy-bank.png')} />

      <View style={styles.balanceRow}>
        <Text style={styles.balanceText}>
          Balance: {balance !== null ? `${balance}` : '--'}
        </Text>
        <Image
          source={require('../assets/images/coin.png')}
          style={styles.coin}
        />
      </View>
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
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginRight: 8,
  },
  coin: {
    width: 28,
    height: 28,
  },
});
