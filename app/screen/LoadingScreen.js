// app/screens/LoadingScreen.js
// Re-usable loading page with animated gradient background
import React from "react";
import { StyleSheet, View } from "react-native";
import { MotiView } from "moti";

import GradientBackground from "../components/GradientBackground"; // animated 3-stop bg 🎨

// ---------------------------------------------------
//  Circular loader
// ---------------------------------------------------
const CIRCLE_COLOR = "#161923";            // 🆕 brand colour for ring + shadow

const LoadingIndicator = ({ size = 100 }) => (
  <MotiView
    from={{
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 0,
      shadowOpacity: 0.5,
    }}
    animate={{
      width: size + 20,
      height: size + 20,
      borderRadius: (size + 20) / 2,
      borderWidth: size / 10,
      shadowOpacity: 1,
    }}
    transition={{
      type: "timing",
      duration: 1000,
      loop: true,
    }}
    style={[
      styles.ring,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: size / 10,
      },
    ]}
  />
);

// ---------------------------------------------------
//  Screen wrapper
// ---------------------------------------------------
export default function LoadingScreen() {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <LoadingIndicator size={100} />
      </View>
    </GradientBackground>
  );
}

// ---------------------------------------------------
//  Styles
// ---------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ring: {
    borderColor: CIRCLE_COLOR,            // 🆕 dark ring
    shadowColor: CIRCLE_COLOR,            // 🆕 dark glow
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    backgroundColor: "transparent",
  },
});
