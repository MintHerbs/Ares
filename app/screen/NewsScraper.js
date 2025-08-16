import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Platform, StatusBar,
  FlatList, TouchableOpacity, Linking, ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { supabase } from '../lib/supabase';

async function fetchDbLinks() {
  const { data, error } = await supabase.from('News').select('url').order('created_at', {ascending: false});
  if (error) throw error;
  return (data ?? []).map(r => r.url).filter(Boolean);
}

export default function NewsScraper({ route }) {
  const tabH = useBottomTabBarHeight();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const mergeLinks = useCallback((dbLinks) => {
    const fromRoute = route?.params?.links ?? [];
    return [...new Set([...fromRoute, ...dbLinks])];
  }, [route?.params?.links]);

  const load = useCallback(async () => {
    try {
      const dbLinks = await fetchDbLinks();
      setLinks(mergeLinks(dbLinks));
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to fetch links');
    } finally {
      setLoading(false);
    }
  }, [mergeLinks]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const dbLinks = await fetchDbLinks();
      setLinks(mergeLinks(dbLinks));
    } catch (e) {
      Alert.alert('Error', e.message || 'Refresh failed');
    } finally {
      setRefreshing(false);
    }
  }, [mergeLinks]);

  const openLink = async (raw) => {
    let url = String(raw).trim();
    if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url)) url = 'https://' + url;
    url = encodeURI(url);
    const can = await Linking.canOpenURL(url);
    if (!can) return Alert.alert("Can't open this link", url);
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading links…</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>News</Text>
      </View>

      <View style={{ flex: 1, padding: 16, paddingBottom: tabH + 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>
          Incoming Links
        </Text>

        <FlatList
          data={links}
          keyExtractor={(item, i) => item + i}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openLink('https://lexpress.mu' + item)}>
              <Text style={{ marginVertical: 8, textDecorationLine: 'underline', color: 'blue' }}>
                {String('https://lexpress.mu' + item)}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text>no links yet 😅</Text>}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F4F4' },
  header: {
    height: 56, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ddd',
  },
  headerTitle: { fontSize: 16, fontWeight: '600' },
});
