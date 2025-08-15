// App.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapWeb from './app/screen/MapWeb';

export default function App() {
  return (
    <View style={styles.root}>
      <MapWeb />
    </View>
  );
}
const styles = StyleSheet.create({ root: { flex: 1 } });
