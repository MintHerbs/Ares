// app/screen/Map.js
//attempt 2 -NB_MAP_homeScree- started fresh on this one 
// app/screen/Map.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';

export default function Map() {
  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        mapType="none" // no Google base map; we’ll render OSM tiles instead
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <UrlTile
          urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          shouldReplaceMapContent={true}
        />
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });
