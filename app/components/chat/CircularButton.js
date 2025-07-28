// app/components/CircularButton.js

import React, { useState } from "react"
import { StyleSheet, TouchableOpacity, Image } from "react-native"
import { LinearGradient as RadialGradient } from "expo-linear-gradient"

function CircularButton({ 
  iconSource, 
  onPress, 
  size = 50, 
  iconSize = 20, 
  isActive = false,
  activeColor = "#FF6B6B" 
}) {
  const [isPressed, setIsPressed] = useState(false)

  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  const radius = size / 2
  const gradientCenter = [radius, radius]

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          width: size, 
          height: size, 
          borderRadius: radius,
          borderColor: isActive ? activeColor : "#40474F"
        }
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <RadialGradient
        colors={[
          "rgba(165, 190, 217, 0.19)",
          isPressed || isActive ? "rgba(63, 77, 88, 0.23)" : "rgba(63, 77, 88, 0.36)"
        ]}
        stops={[0, 1]}
        center={gradientCenter}
        radius={radius}
        style={styles.gradient}
      >
        <Image 
          source={iconSource}
          style={[styles.icon, { width: iconSize, height: iconSize }]}
          resizeMode="contain"
        />
      </RadialGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    // Icon size will be set dynamically via props
  },
})

export default CircularButton