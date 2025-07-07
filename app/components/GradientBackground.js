// app/components/GradientBackground.js

import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../config/colors";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

function GradientBackground({ children, style }) {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fade, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, [fade]);

  return (
    <View style={[styles.container, style]}>
      {/* Animated layer behind everything */}
      <AnimatedGradient
        colors={["#FFF7FA", "#F7F3F2", colors.background]}
        start={[0, 0]}
        end={[1, 1]}
        style={[StyleSheet.absoluteFill, { opacity: fade }]}
      />

      {/* Your actual screen content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
