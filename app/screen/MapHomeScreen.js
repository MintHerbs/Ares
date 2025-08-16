// app/screen/MapHomeScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import MapWeb from './MapWeb';
import { registerForPushToken } from '../push';

const HEADER_H = 56;

export default function MapHomeScreen() {
  const tabH = useBottomTabBarHeight();

  useEffect(() => {
    (async () => {
      const token = await registerForPushToken();
      if (token) {
        await fetch('https://real-time-alert.onrender.com/register-device', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, userId: '123' }),
        });
      }
    })();
  }, []);

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Map</Text>
      </View>

      {/* Keep the map full-height; add bottom padding so your tab bar
          (which is positioned absolute) doesn’t cover zoom controls */}
      <View style={[styles.mapArea, { paddingBottom: tabH + 8 }]}>
        <MapWeb />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F4F4' },
  header: {
    height: HEADER_H,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  mapArea: { flex: 1, backgroundColor: '#fff' },
});