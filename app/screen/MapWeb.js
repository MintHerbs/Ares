// app/screen/MapWeb.js
import React, { useMemo, useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * Props:
 * - initialCenter: { lat: number, lng: number, zoom?: number }
 * - onMarkersChange?: (markers: Array<{lat:number,lng:number}>) => void
 */
export default function MapWeb({
  initialCenter = { lat: -20.1609, lng: 57.5012, zoom: 12 },
  onMarkersChange,
}) {
  const webRef = useRef(null);

  // Build the HTML once, with our initial center injected
  const html = useMemo(() => `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1, width=device-width, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; }
  .controls {
    position: absolute; top: 10px; right: 10px; z-index: 1000;
    display: flex; gap: 8px;
  }
  .controls button {
    padding: 8px 10px; border: 0; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.2);
    font-size: 14px;
  }
</style>
</head>
<body>
<div id="map"></div>
<div class="controls">
  <button id="fitBtn">Fit</button>
  <button id="clearBtn">Clear</button>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  // --- Map init ---
  const center = [${initialCenter.lat}, ${initialCenter.lng}];
  const zoom = ${initialCenter.zoom ?? 12};
  const map = L.map('map', { zoomControl: true }).setView(center, zoom);

  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // --- Marker management ---
  const group = L.featureGroup().addTo(map);

  function reportMarkers() {
    const data = group.getLayers().map(m => {
      const p = m.getLatLng();
      return { lat: p.lat, lng: p.lng };
    });
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markers', data }));
    }
  }

  function addMarker(lat, lng) {
    const m = L.marker([lat, lng], { draggable: true });
    m.on('dragend', reportMarkers);
    // Long-press (contextmenu) to delete
    m.on('contextmenu', () => { group.removeLayer(m); reportMarkers(); });
    m.addTo(group);
    reportMarkers();
  }

  function clearMarkers() {
    group.clearLayers(); reportMarkers();
  }

  function fitMarkers() {
    const layers = group.getLayers();
    if (layers.length > 0) { map.fitBounds(group.getBounds().pad(0.2)); }
  }

  // Tap to add
  map.on('click', (e) => addMarker(e.latlng.lat, e.latlng.lng));

  // Buttons
  document.getElementById('fitBtn').addEventListener('click', fitMarkers);
  document.getElementById('clearBtn').addEventListener('click', clearMarkers);

  // --- Receive messages from React Native ---
  function handleRnMessage(msg) {
    try {
      const { type, data } = JSON.parse(msg);
      if (type === 'clear') clearMarkers();
      else if (type === 'fit') fitMarkers();
      else if (type === 'flyTo' && data) map.flyTo([data.lat, data.lng], data.zoom || 14);
      else if (type === 'loadMarkers' && Array.isArray(data)) {
        clearMarkers();
        data.forEach(p => addMarker(p.lat, p.lng));
      }
    } catch (e) {
      console.error('Bad RN message', e);
    }
  }

  // Android & iOS bridges
  document.addEventListener('message', (ev) => handleRnMessage(ev.data));
  window.addEventListener('message', (ev) => handleRnMessage(ev.data));
</script>
</body>
</html>
`, [initialCenter]);

  // Receive marker updates from the WebView
  const onMessage = useCallback((event) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data);
      if (payload?.type === 'markers' && onMarkersChange) {
        onMarkersChange(payload.data || []);
      }
    } catch {}
  }, [onMarkersChange]);

  // Helper to send commands into the web map (optional export)
  const send = useCallback((obj) => {
    if (!webRef.current) return;
    webRef.current.postMessage(JSON.stringify(obj));
  }, []);

  // We could expose `send` via ref if we want to call from a parent later
  // For now we just render the WebView.
  return (
    <WebView
      ref={webRef}
      originWhitelist={['*']}
      source={{ html }}
      onMessage={onMessage}
      javaScriptEnabled
      geolocationEnabled // if later we add locate-me features
      allowsInlineMediaPlayback
      style={styles.fill}
    />
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
