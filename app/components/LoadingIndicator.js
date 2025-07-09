// app/components/LoadingIndicator.js
import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { MotiView } from "moti";

const CIRCLE_COLOR = "#ffffff"; // Brand color for ring + shadow

export default function LoadingIndicator({ size = 20 }) {
  const endSize = size * 1.2;       // small pulse
  const border = size / 10;

  return (
    <View style={{ width: endSize, height: endSize, alignItems:"center", justifyContent:"center" }}>
      {/* glow */}
      <MotiView
        from={{ opacity: 0.4, scale: 1 }}
        animate={{ opacity: 1, scale: endSize/size }}
        transition={{ type: "timing", duration: 800, loop: true }}
        style={[
          styles.glow,
          { width: size, height: size, borderRadius: 9999 }
        ]}
      />
      {/* ring */}
      <MotiView
        from={{ width: size, height: size, borderWidth: 0 }}
        animate={{ width: endSize, height: endSize, borderWidth: border }}
        transition={{ type: "timing", duration: 800, loop: true }}
        style={[
          styles.ring,
          { borderRadius: 9999 }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    backgroundColor: "transparent",
    shadowColor: CIRCLE_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  ring: {
    backgroundColor: "transparent",
    borderColor: CIRCLE_COLOR,
  },
});
