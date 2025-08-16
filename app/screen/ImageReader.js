import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Image, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';

export default function ImageReader() {
    const tabH = useBottomTabBarHeight();
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    const openCamera = async () => {
        try {
            setLoading(true);
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera permission is required to take a picture.');
                setLoading(false);
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaType,
                quality: 0.8,
                allowsEditing: false,
                exif: false,
                base64: false,
            });

            if (!result.canceled) {
                setPhoto(result.assets[0]); // { uri, width, height, ... }
            }
        } catch (e) {
            console.warn(e);
            Alert.alert('Oops', 'Could not open the camera.');
        } finally {
            setLoading(false);
        }
    };

    const translate_picture = async () => {
        alert("good shit");
    }

    const sendToBackend = async (localUri) => {
        const form = new FormData();
        form.append('image', {
          uri: localUri,
          name: 'capture.jpg',
          type: 'image/jpeg',
        });
      
        const r = await fetch('https://real-time-alert.onrender.com/translate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          body: form,
        });
      
        const data = await r.json();
        if (data.translation) {
          alert(data.translation);
        } else {
          alert('No translation found.');
        }
      };

    return (
        <View style={[styles.screen, { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0 }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Image Reader</Text>
            </View>

            <View>
                <Text>Take a picture and I'll translate for you.</Text>
                <Pressable onPress={openCamera} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}>
                    { !photo ? <Text style={styles.btnTxt}>Open Camera</Text> : <Text style={styles.btnTxt}>Retake</Text> }
                </Pressable>

                {loading && (
                    <View style={{ marginTop: 12 }}>
                        <ActivityIndicator />
                    </View>
                )}

                {photo && (
                    <View style={{ marginTop: 12 }}>
                        <Image source={{ uri: photo.uri }} style={styles.preview} resizeMode="cover" />
                        <Pressable onPress={() => photo && sendToBackend(photo.uri)} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}>
                            <Text style={styles.btnTxt}>Translate Picture</Text>
                        </Pressable>
                    </View>
                    
                )}
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

    btn: {
        marginTop: 12,
        backgroundColor: '#111827',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    btnTxt: { color: '#fff', fontWeight: '600' },
    preview: { width: '100%', aspectRatio: 3 / 4, borderRadius: 12, backgroundColor: '#e5e7eb' },
    caption: { fontSize: 12, color: '#6b7280', marginTop: 6 },
});