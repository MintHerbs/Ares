// app/storage/savedSpots.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'saved_spots_v1';
let memo = null;
const listeners = new Set();

async function load() {
  if (memo) return memo;
  const raw = await AsyncStorage.getItem(KEY);
  memo = raw ? JSON.parse(raw) : [];
  return memo;
}
async function persist(data) {
  memo = data;
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
  listeners.forEach((fn) => fn(memo));
}

export async function getSpots() {
  return await load();
}
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export async function addSpot(spot) {
  const data = await load();
  const id = spot.id || `${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const newSpot = {
    id,
    name: spot.name || 'Unnamed',
    lat: Number(spot.lat),
    lng: Number(spot.lng),
    type: spot.type || 'pin',
    address: spot.address || '',
  };
  // de-duplicate on id if provided
  const i = data.findIndex(s => s.id === id);
  if (i >= 0) data[i] = newSpot; else data.unshift(newSpot);
  await persist(data);
  return id;
}
export async function removeSpot(id) {
  const data = await load();
  await persist(data.filter(s => s.id !== id));
}
export async function clearSpots() {
  await persist([]);
}
