// app/storage/savedSpots.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@ares:saved_spots:v1';
const listeners = new Set();
const notify = () => listeners.forEach(fn => fn());

export async function getSpots() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addSpot(spot) {
  // spot: { id, name, lat, lng, type? }
  const list = await getSpots();
  const id = String(spot.id ?? `${spot.lat},${spot.lng}`);
  const idx = list.findIndex(s => String(s.id) === id);
  if (idx >= 0) list[idx] = { ...list[idx], ...spot };
  else list.push({ ...spot, id });
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
  notify();                    // ← IMPORTANT
  return list;
}

export async function removeSpot(id) {
  const list = await getSpots();
  const next = list.filter(s => String(s.id) !== String(id));
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  notify();                    // ← IMPORTANT
  return next;
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
