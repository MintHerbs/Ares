// app/components/AiLandingPage/newChatButton.js

import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../config/colors"; // path fixed for components/AiLandingPage/

function NewChatButton() {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn  = () => setIsPressed(true);
  const handlePressOut = () => setIsPressed(false);

  const handlePress = () => {
    // Handle button press action here
    console.log("New Chat button pressed");
  };

  return (
    // Use a plain View so there is no inherited background from a Screen wrapper
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          activeOpacity={1}
        >
          {/* expo-linear-gradient does not support true radial gradients.
             This uses a linear gradient with locations as a close visual. */}
          <LinearGradient
            colors={[
              "rgba(165, 190, 217, 0.19)",
              isPressed ? "rgba(63, 77, 88, 0.23)" : "rgba(63, 77, 88, 0.36)"
            ]}
            locations={[0, 1]}
            start={{ x: 0.3, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text style={styles.plusIcon}>+</Text>
              <Text style={styles.buttonText}>New Chat</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",   // ensure no white background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: 280,
    height: 61,
  },
  button: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#40474F",
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "400",
    position: "absolute",
    right: 100,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default NewChatButton;
