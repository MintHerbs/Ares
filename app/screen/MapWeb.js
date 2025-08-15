import React, { useMemo, useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapWeb({
  initialCenter = { lat: -20.1609, lng: 57.5012, zoom: 12 },
  onMarkersChange,
}) {
  const webRef = useRef(null);

  const html = useMemo(() => `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1, width=device-width, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; }

  .ui { position: absolute; z-index: 1000; }

  /* ========= CHANGED: reserve right-side space for controls ========= */
  /* was: .search { top: 10px; left: 10px; right: 10px; } */
  .search { top: 10px; left: 10px; right: 160px; } /* tweak 140–180px to taste */
  .search form { display: flex; gap: 8px; }
  .search input {
    flex: 1; font-size: 16px; padding: 10px 12px; border-radius: 10px;
    background: #fff; border: 1px solid #ccc; box-shadow: 0 2px 8px rgba(0,0,0,.15);
  }
  .search button {
    padding: 10px 12px; border: 0; border-radius: 10px; background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,.2); font-size: 14px;
  }
  .results {
    margin-top: 6px; background: #fff; border: 1px solid #ddd; border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,.2); max-height: 220px; overflow: auto;
  }
  .item { padding: 10px 12px; border-top: 1px solid #eee; }
  .item:first-child { border-top: 0; }
  .item:active { background: #f3f3f3; }
  .nores { padding: 10px 12px; color: #777; }

  /* ========= CHANGED: right stack fixed width & stays at top-right ========= */
  .rightStack {
    top: 70px; right: 10px;
    display: flex; flex-direction: column; gap: 8px;
    width: 140px; /* matches the space we reserved above */
  }
  .controls { display: flex; gap: 8px; }
  .controls button {
    padding: 8px 10px; border: 0; border-radius: 8px; background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,.2); font-size: 14px;
  }
  .picker select {
    width: 100%;
    font-size: 14px; padding: 6px 8px; border-radius: 8px;
    background: #fff; border: 1px solid #ccc; box-shadow: 0 2px 8px rgba(0,0,0,.15);
  }

  /* markers */
  .emoji-marker {
    display: grid; place-items: center;
    width: 40px; height: 40px; border-radius: 20px;
    background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.25); border: 1px solid rgba(0,0,0,.1);
    transform: translate(-20px, -20px);
  }
  .emoji-marker span { font-size: 22px; line-height: 1; }
</style>
</head>
<body>
<div id="map"></div>

<div class="ui search">
  <form id="searchForm">
    <input id="searchInput" placeholder="Search a place (exact name works best)"/>
    <button id="searchBtn" type="submit">Search</button>
  </form>
  <div id="searchResults" class="results"></div>
</div>

<div class="ui rightStack">
  <div class="controls">
    <button id="fitBtn">Fit</button>
    <button id="clearBtn">Clear</button>
  </div>
  <div class="picker">
    <select id="typePicker">
      <option value="pin">📍 Pin</option>
      <option value="home">🏠 Home</option>
      <option value="bus">🚌 Bus</option>
      <option value="entertainment">🎉 Fun</option>
      <option value="restaurant">🍽️ Food</option>
      <option value="shopping">🛍️ Shop</option>
    </select>
  </div>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const center = [${initialCenter.lat}, ${initialCenter.lng}];
  const zoom = ${initialCenter.zoom ?? 12};

  /* already moved earlier: zoom at bottom-right */
  const map = L.map('map', { zoomControl: false }).setView(center, zoom);
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const group = L.featureGroup().addTo(map);

  const TYPE_EMOJI = { pin:'📍', home:'🏠', bus:'🚌', entertainment:'🎉', restaurant:'🍽️', shopping:'🛍️' };

  function makeIcon(type){
    const emoji = TYPE_EMOJI[type] || TYPE_EMOJI.pin;
    return L.divIcon({ className:'emoji-marker', html:'<span>'+emoji+'</span>', iconSize:[40,40], iconAnchor:[20,20] });
  }

  function reportMarkers(){
    const data = group.getLayers().map(m => {
      const p = m.getLatLng();
      const t = m.options && m.options.meta ? m.options.meta.type : 'pin';
      return { lat:p.lat, lng:p.lng, type:t };
    });
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({ type:'markers', data }));
  }

  function addMarker(lat,lng,type){
    const marker = L.marker([lat,lng], { draggable:true, icon:makeIcon(type), meta:{ type } });
    marker.on('dragend', reportMarkers);
    marker.on('contextmenu', () => { group.removeLayer(marker); reportMarkers(); });
    marker.addTo(group); reportMarkers();
  }

  function clearMarkers(){ group.clearLayers(); reportMarkers(); }
  function fitMarkers(){
    const layers = group.getLayers();
    if (layers.length > 0) map.fitBounds(group.getBounds().pad(0.2));
  }

  const picker = document.getElementById('typePicker');
  let currentType = picker.value;
  picker.addEventListener('change', e => currentType = e.target.value);

  map.on('click', e => addMarker(e.latlng.lat, e.latlng.lng, currentType));
  document.getElementById('fitBtn').addEventListener('click', fitMarkers);
  document.getElementById('clearBtn').addEventListener('click', clearMarkers);

  /* search */
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  function escHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',\"'\":'&#39;'}[c])); }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const q = (input.value || '').trim();
    if (!q) return;
    results.innerHTML = '<div class="item">Searching…</div>';
    try{
      const url = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=' + encodeURIComponent(q);
      const resp = await fetch(url);
      const data = await resp.json();
      if (!Array.isArray(data) || data.length === 0){
        results.innerHTML = '<div class="nores">No results</div>'; return;
      }
      results.innerHTML = data.map(d =>
        '<div class="item" data-lat="'+d.lat+'" data-lon="'+d.lon+'">' + escHtml(d.display_name) + '</div>'
      ).join('');
    }catch{
      results.innerHTML = '<div class="nores">Search failed</div>';
    }
  });

  results.addEventListener('click', e => {
    const item = e.target.closest('.item'); if (!item) return;
    const lat = parseFloat(item.dataset.lat), lon = parseFloat(item.dataset.lon);
    map.flyTo([lat, lon], 14);
    addMarker(lat, lon, 'pin'); /* drop a pin on selection */
    results.innerHTML = '';
  });

  function handleRnMessage(msg){
    try{
      const { type, data } = JSON.parse(msg);
      if (type === 'clear') clearMarkers();
      else if (type === 'fit') fitMarkers();
      else if (type === 'flyTo' && data) map.flyTo([data.lat, data.lng], data.zoom || 14);
      else if (type === 'loadMarkers' && Array.isArray(data)){
        clearMarkers(); data.forEach(p => addMarker(p.lat, p.lng, p.type || 'pin'));
      }
    }catch(e){ console.error('Bad RN message', e); }
  }
  document.addEventListener('message', ev => handleRnMessage(ev.data));
  window.addEventListener('message', ev => handleRnMessage(ev.data));
</script>
</body>
</html>`, [initialCenter]);

  const onMessage = useCallback((event) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data);
      if (payload?.type === 'markers' && onMarkersChange) onMarkersChange(payload.data || []);
    } catch {}
  }, [onMarkersChange]);

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
