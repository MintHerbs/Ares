// app/components/ModeToggle.js

import React, { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import { LinearGradient as RadialGradient } from "expo-linear-gradient"

function ModeToggle({ selectedMode, onModeChange }) {
  const [pressedButton, setPressedButton] = useState(null)

  const handlePressIn = (mode) => {
    setPressedButton(mode)
  }

  const handlePressOut = () => {
    setPressedButton(null)
  }

  const handleModePress = (mode) => {
    onModeChange(mode)
  }

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleButton, selectedMode === 'chat' && styles.activeToggle]}
        onPress={() => handleModePress('chat')}
        onPressIn={() => handlePressIn('chat')}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <RadialGradient
          colors={[
            "rgba(165, 190, 217, 0.19)",
            selectedMode === 'chat' || pressedButton === 'chat' ? "rgba(63, 77, 88, 0.23)" : "rgba(63, 77, 88, 0.36)"
          ]}
          stops={[0, 1]}
          center={[25, 25]}
          radius={25}
          style={styles.toggleGradient}
        >
          <Image 
            source={require("../../assets/AiChat/Chat.png")}
            style={styles.toggleIcon}
            resizeMode="contain"
          />
        </RadialGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.toggleButton, selectedMode === 'voice' && styles.activeToggle]}
        onPress={() => handleModePress('voice')}
        onPressIn={() => handlePressIn('voice')}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <RadialGradient
          colors={[
            "rgba(165, 190, 217, 0.19)",
            selectedMode === 'voice' || pressedButton === 'voice' ? "rgba(63, 77, 88, 0.23)" : "rgba(63, 77, 88, 0.36)"
          ]}
          stops={[0, 1]}
          center={[25, 25]}
          radius={25}
          style={styles.toggleGradient}
        >
          <Image 
            source={require("../../assets/AiChat/Voice.png")}
            style={styles.toggleIcon}
            resizeMode="contain"
          />
          <Text style={styles.voiceText}>Voice</Text>
        </RadialGradient>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(63, 77, 88, 0.3)',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#40474F",
    padding: 4,
  },
  toggleButton: {
    width: 80,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: "#40474F",
    overflow: "hidden",
    marginHorizontal: 2,
  },
  activeToggle: {
    borderColor: "#A5BED9",
  },
  toggleGradient: {
    width: "100%",
    height: "100%",
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
  },
  toggleIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  voiceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: "500",
  },
})

export default ModeToggle