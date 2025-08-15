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

  /* search (left) + reserved right stack */
  .search { top: 10px; left: 10px; right: 160px; }
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

  /* right stack (Fit/Clear + marker type) */
  .rightStack { top: 70px; right: 10px; display: flex; flex-direction: column; gap: 8px; width: 140px; }
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

  /* JOURNAL: collapsible left panel */
  .journal-toggle {
    top: 70px; left: 10px; padding: 8px 10px; background: #fff; border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,.2); font-size: 14px;
  }
  .journal {
    top: 70px; bottom: 80px; left: 10px; width: 260px; background: #fff;
    border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,.25); border: 1px solid #ddd;
    overflow: hidden; transform: translateX(-110%); transition: transform .2s ease;
  }
  .journal.open { transform: translateX(0); }
  .journal header {
    padding: 10px 12px; font-weight: 600; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid #eee;
  }
  .journal .section { padding: 10px 12px; }
  .journal .row { display: flex; gap: 8px; align-items: center; }
  .journal input[type="date"] {
    flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 8px;
  }
  .journal button {
    padding: 8px 10px; border: 0; border-radius: 8px; background: #f6f6f6;
    box-shadow: 0 1px 4px rgba(0,0,0,.12); font-size: 14px;
  }
  .journal .list { max-height: 50vh; overflow: auto; }
  .journal .entry { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
  .journal .entry:last-child { border-bottom: 0; }
  .journal .entry .meta { font-size: 12px; color: #666; }
  .journal .entry .actions { display: flex; gap: 6px; margin-top: 6px; }
  .pill { background: #eef3ff; color: #334; padding: 2px 6px; border-radius: 999px; font-size: 11px; }

  /* emoji markers */
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

<!-- search -->
<div class="ui search">
  <form id="searchForm">
    <input id="searchInput" placeholder="Search a place (exact name works best)"/>
    <button id="searchBtn" type="submit">Search</button>
  </form>
  <div id="searchResults" class="results"></div>
</div>

<!-- right side controls -->
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

<!-- JOURNAL: toggle + panel -->
<div class="ui journal-toggle" id="journalToggle">📓 Journal</div>
<div class="ui journal" id="journal">
  <header>
    <span>Itinerary Journal</span>
    <button id="journalClose">✕</button>
  </header>
  <div class="section">
    <div class="row">
      <input type="date" id="dateInput" />
      <button id="saveEntry">Save</button>
    </div>
    <div class="row" style="margin-top:6px;">
      <span class="pill" id="countPill">0 markers</span>
    </div>
  </div>
  <div class="section">
    <div style="font-weight:600; margin-bottom:6px;">Saved dates</div>
    <div id="entries" class="list"></div>
  </div>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const center = [${initialCenter.lat}, ${initialCenter.lng}];
  const zoom = ${initialCenter.zoom ?? 12};

  // map + zoom control bottom-right
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

  function serializeMarkers(){
    return group.getLayers().map(m => {
      const p = m.getLatLng();
      const t = m.options && m.options.meta ? m.options.meta.type : 'pin';
      return { lat:p.lat, lng:p.lng, type:t };
    });
  }

  function reportMarkers(){
    const data = serializeMarkers();
    document.getElementById('countPill').textContent = data.length + ' markers';
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

  // add by tapping
  map.on('click', e => addMarker(e.latlng.lat, e.latlng.lng, currentType));
  document.getElementById('fitBtn').addEventListener('click', fitMarkers);
  document.getElementById('clearBtn').addEventListener('click', clearMarkers);

  // search
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
    addMarker(lat, lon, 'pin');
    results.innerHTML = '';
  });

  /* ===== JOURNAL (localStorage) ===== */
  const STORAGE_INDEX = 'itinerary:index'; // JSON array of date strings
  const STORAGE_PREFIX = 'itinerary:';     // itinerary:YYYY-MM-DD => JSON markers

  const journal = document.getElementById('journal');
  const toggleBtn = document.getElementById('journalToggle');
  const closeBtn  = document.getElementById('journalClose');
  const dateInput = document.getElementById('dateInput');
  const saveBtn   = document.getElementById('saveEntry');
  const listEl    = document.getElementById('entries');

  // default date = today
  dateInput.valueAsDate = new Date();

  function getIndex(){
    try { return JSON.parse(localStorage.getItem(STORAGE_INDEX) || '[]'); }
    catch { return []; }
  }
  function setIndex(arr){
    localStorage.setItem(STORAGE_INDEX, JSON.stringify(arr));
  }
  function keyFor(dateStr){ return STORAGE_PREFIX + dateStr; }

  function loadEntry(dateStr){
    try {
      const raw = localStorage.getItem(keyFor(dateStr));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }
  function saveEntry(dateStr, markers){
    localStorage.setItem(keyFor(dateStr), JSON.stringify(markers));
    const idx = new Set(getIndex());
    idx.add(dateStr);
    setIndex(Array.from(idx).sort()); // keep sorted ascending; tweak if you want desc
  }
  function deleteEntry(dateStr){
    localStorage.removeItem(keyFor(dateStr));
    const next = getIndex().filter(d => d !== dateStr);
    setIndex(next);
  }

  function renderEntries(){
    const dates = getIndex();
    if (dates.length === 0){ listEl.innerHTML = '<div class="nores">No saved days</div>'; return; }
    listEl.innerHTML = dates.map(date => {
      const m = loadEntry(date) || [];
      const count = Array.isArray(m) ? m.length : 0;
      return '<div class="entry" data-date="'+date+'">'
          + '<div><strong>'+date+'</strong> <span class="meta">('+count+' markers)</span></div>'
          + '<div class="actions">'
          + '  <button data-action="load">Load</button>'
          + '  <button data-action="delete">Delete</button>'
          + '</div>'
          + '</div>';
    }).join('');
  }

  // open/close
  toggleBtn.addEventListener('click', () => journal.classList.add('open'));
  closeBtn.addEventListener('click', () => journal.classList.remove('open'));

  // save current markers to selected date
  saveBtn.addEventListener('click', () => {
    const ds = (dateInput.value || '').trim();
    if (!ds){ alert('Pick a date first'); return; }
    const markers = serializeMarkers();
    saveEntry(ds, markers);
    renderEntries();
    // optional feedback
    toggleBtn.textContent = '📓 Saved!';
    setTimeout(() => toggleBtn.textContent = '📓 Journal', 800);
  });

  // list item actions
  listEl.addEventListener('click', (e) => {
    const entry = e.target.closest('.entry'); if (!entry) return;
    const dateStr = entry.dataset.date;
    const action = e.target.getAttribute('data-action');
    if (action === 'load'){
      const markers = loadEntry(dateStr) || [];
      clearMarkers();
      markers.forEach(p => addMarker(p.lat, p.lng, p.type || 'pin'));
      fitMarkers();
    } else if (action === 'delete'){
      deleteEntry(dateStr);
      renderEntries();
    }
  });

  // initial render
  renderEntries();

  // RN bridge (still supported)
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
