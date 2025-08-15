// App.js
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import MapWeb from './app/screen/MapWeb';

const HEADER_H = 56;   // tweak to your Figma
const FOOTER_H = 64;   // tweak to your Figma

export default function App() {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Map</Text>
      </View>

      <View style={styles.mapArea}>
        <MapWeb />
      </View>

      <View style={styles.footer}>
        {/* put your bottom nav / icons here */}
        <Text style={styles.footerText}>Footer / Tabs</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    // Prevent the map from drawing under the Android status bar
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
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
  footer: {
    height: FOOTER_H,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: { fontSize: 13, color: '#666' },
});

// Example snippet inside App.js
// const [markers, setMarkers] = useState([]);
// useEffect(() => {
//   console.log('Current markers:', markers);
//   // Here we can persist to AsyncStorage or a backend later.
// }, [markers]);
