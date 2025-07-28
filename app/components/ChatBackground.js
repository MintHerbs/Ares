import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function ChatBackground({
  colors = ['#010323', '#010532', '#010539', '#010640'], // Colors from my figma
  locations = [0, 0.5, 0.75, 1], // converted Stop locations from figma into decimal
  start = { x: 0, y: 0 }, // start of da bloody gradient
  end = { x: 0, y: 1 }, // end of dis bitch
  children, // and they lived happily ever after
  ...otherProps // basic react native
}) {
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={start}
      end={end}
      style={styles.gradient}
      {...otherProps}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    ...StyleSheet.absoluteFillObject
  }
});

export default ChatBackground;
