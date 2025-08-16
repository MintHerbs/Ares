// app/screen/MapHomeScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';               // ← NEW
import MapWeb from './MapWeb';
import { registerForPushToken } from '../push';


// ← NEW: saved-spots helpers
import { getSpots, subscribe, removeSpot } from '../storage/savedSpots';

const HEADER_H = 56;

export default function MapHomeScreen() {
  const tabH = useBottomTabBarHeight();

  // ← NEW: keep saved spots in React state
  const [savedSpots, setSavedSpots] = useState([]);

  // ← NEW: load & memoized refresh
  const refreshSaved = useCallback(async () => {
    const list = await getSpots();
    setSavedSpots(list);
  }, []);

  // ← NEW: refresh whenever this tab/screen gains focus,
  // and live-update via the storage subscription
  useFocusEffect(
    useCallback(() => {
      refreshSaved();
      const unsubscribe = subscribe(refreshSaved);
      return unsubscribe;
    }, [refreshSaved])
  );

  // ← NEW: handler for remove requests coming from the WebView
  const handleRemoveSavedSpot = useCallback(async (id) => {
    await removeSpot(id);
    await refreshSaved();
  }, [refreshSaved]);

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
        <MapWeb
          // ← NEW: feed saved spots into the WebView
          savedSpots={savedSpots}
          // ← NEW: allow the WebView to ask RN to remove one
          onRequestRemoveSavedSpot={handleRemoveSavedSpot}
          // (optional) you can still use onMarkersChange if you want:
          // onMarkersChange={(m) => console.log('markers:', m)}
        />
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
