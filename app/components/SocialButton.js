// app/components/SocialButton.js

import React from "react";
import { StyleSheet, TouchableOpacity, Image, Text } from "react-native";

import colors from "../config/colors";

function SocialButton({ icon, title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    width: "100%",          // parent sets final width
    borderWidth: 2,
    borderColor: colors.light,
    backgroundColor: "transparent",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  text: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    marginLeft: 8,
    color: colors.dark,
  },
});

export default SocialButton;
