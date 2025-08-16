import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function ImageReader() {
    const tabH = useBottomTabBarHeight();

    return (
        <View style={[styles.screen, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Image Reader</Text>
            </View>

            <View>
                <Text>Take a picture and I'll translate for you.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F4F4F4' },
    header: {
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
    },
    headerTitle: { fontSize: 16, fontWeight: '600' },
    mapArea: { flex: 1, backgroundColor: '#fff' },
});