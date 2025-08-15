// App.js
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button, Alert } from 'react-native';
import MapWeb from './app/screen/MapWeb';

export default function App() {
  const [markers, setMarkers] = useState([]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.toolbar}>
        <Button title="Show count" onPress={() => Alert.alert(`Markers: ${markers.length}`)} />
      </View>
      <View style={styles.mapArea}>
        <MapWeb
          initialCenter={{ lat: -20.1609, lng: 57.5012, zoom: 12 }}
          onMarkersChange={setMarkers}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toolbar: { padding: 8, backgroundColor: '#f5f5f5' },
  mapArea: { flex: 1 },
});
