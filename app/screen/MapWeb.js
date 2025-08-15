// app/screen/MapWeb.js
import React, { useMemo, useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * Props:
 * - initialCenter: { lat: number, lng: number, zoom?: number }
 * - onMarkersChange?: (markers: Array<{lat:number,lng:number,type:string}>) => void
 */
export default function MapWeb({
  initialCenter = { lat: -20.1609, lng: 57.5012, zoom: 12 },
  onMarkersChange,
}) {
  const webRef = useRef(null);

  // Build the HTML once; inject initial center
  const html = useMemo(
    () => `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1, width=device-width, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; }

  /* Top-right utility controls */
  .controls {
    position: absolute; top: 10px; right: 10px; z-index: 1000;
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .controls button {
    padding: 8px 10px; border: 0; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.2);
    font-size: 14px;
  }

  /* Top-left marker palette */
  .palette {
    position: absolute; top: 10px; left: 10px; z-index: 1000;
    display: flex; gap: 8px; flex-wrap: wrap; background: rgba(255,255,255,0.9);
    border-radius: 10px; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,.2);
  }
  .palette .opt {
    border: 0; background: transparent; padding: 6px 8px; border-radius: 8px; font-size: 18px;
  }
  .palette .opt.active { background: #e8f0fe; }
  .palette .lbl { font-size: 12px; display: block; margin-top: 2px; color: #333; text-align: center; }

  /* Emoji marker (Leaflet divIcon) */
  .emoji-marker {
    display: grid; place-items: center;
    width: 40px; height: 40px; border-radius: 20px;
    background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.25); border: 1px solid rgba(0,0,0,.1);
    transform: translate(-20px, -20px); /* center on point */
  }
  .emoji-marker span { font-size: 22px; line-height: 1; }
</style>
</head>
<body>
<div id="map"></div>

<!-- Marker palette (choose type first, then tap map to add) -->
<div class="palette" id="palette">
  <button class="opt" data-type="pin" title="Pin">📍<span class="lbl">Pin</span></button>
  <button class="opt" data-type="home" title="Home/Hotel">🏠<span class="lbl">Home</span></button>
  <button class="opt" data-type="bus" title="Bus">🚌<span class="lbl">Bus</span></button>
  <button class="opt" data-type="entertainment" title="Entertainment">🎉<span class="lbl">Fun</span></button>
  <button class="opt" data-type="restaurant" title="Restaurant">🍽️<span class="lbl">Food</span></button>
  <button class="opt" data-type="shopping" title="Shopping">🛍️<span class="lbl">Shop</span></button>
</div>

<!-- Utility controls -->
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

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // --- Marker management ---
  const group = L.featureGroup().addTo(map);

  // Current marker type selection
  const palette = document.getElementById('palette');
  let currentType = 'pin';
  function selectType(t) {
    currentType = t;
    // visual state
    [...palette.querySelectorAll('.opt')].forEach(b => {
      b.classList.toggle('active', b.dataset.type === t);
    });
  }
  // default selection
  selectType('pin');

  // Map of type -> emoji
  const TYPE_EMOJI = {
    pin: '📍',
    home: '🏠',
    bus: '🚌',
    entertainment: '🎉',
    restaurant: '🍽️',
    shopping: '🛍️',
  };

  function makeIcon(type) {
    const emoji = TYPE_EMOJI[type] || TYPE_EMOJI.pin;
    return L.divIcon({
      className: 'emoji-marker',
      html: '<span>' + emoji + '</span>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }

  function reportMarkers() {
    const data = group.getLayers().map(m => {
      const p = m.getLatLng();
      const t = m.options && m.options.meta ? m.options.meta.type : 'pin';
      return { lat: p.lat, lng: p.lng, type: t };
    });
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markers', data }));
    }
  }

  function addMarker(lat, lng, type) {
    const marker = L.marker([lat, lng], {
      draggable: true,
      icon: makeIcon(type),
      meta: { type }
    });
    marker.on('dragend', reportMarkers);
    // Long-press (contextmenu) to delete
    marker.on('contextmenu', () => { group.removeLayer(marker); reportMarkers(); });
    marker.addTo(group);
    reportMarkers();
  }

  function clearMarkers() { group.clearLayers(); reportMarkers(); }
  function fitMarkers() {
    const layers = group.getLayers();
    if (layers.length > 0) map.fitBounds(group.getBounds().pad(0.2));
  }

  // Tap to add with current type
  map.on('click', (e) => addMarker(e.latlng.lat, e.latlng.lng, currentType));

  // Palette interactions
  palette.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.opt');
    if (!btn) return;
    selectType(btn.dataset.type);
  });

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
        data.forEach(p => addMarker(p.lat, p.lng, p.type || 'pin'));
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
</html>`,
    [initialCenter]
  );

  // Receive marker updates from the WebView and pass up to RN
  const onMessage = useCallback(
    (event) => {
      try {
        const payload = JSON.parse(event.nativeEvent.data);
        if (payload?.type === 'markers' && onMarkersChange) {
          onMarkersChange(payload.data || []);
        }
      } catch {}
    },
    [onMarkersChange]
  );

  // Optional helper to send commands into the web map
  const send = useCallback((obj) => {
    if (!webRef.current) return;
    webRef.current.postMessage(JSON.stringify(obj));
  }, []);

  return (
    <WebView
      ref={webRef}
      originWhitelist={['*']}
      source={{ html }}
      onMessage={onMessage}
      javaScriptEnabled
      geolocationEnabled
      allowsInlineMediaPlayback
      style={styles.fill}
    />
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
