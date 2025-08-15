// app/screen/MapWeb.js
//npx expo install react-native-webview
//This uses the phone’s Chromium/WebView, which usually works even when the native map view doesn’t.
import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const html = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1, width=device-width, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>html,body,#map{height:100%;margin:0;padding:0}</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const lat = -20.1609, lng = 57.5012; // Mauritius default; adjust as needed
  const map = L.map('map').setView([lat, lng], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19, attribution: '&copy; OpenStreetMap'
  }).addTo(map);
  L.marker([lat, lng]).addTo(map);
</script>
</body>
</html>`;

export default function MapWeb() {
  return <WebView originWhitelist={['*']} source={{ html }} style={styles.fill} />;
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
