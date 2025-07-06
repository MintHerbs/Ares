// app/screen/WelcomeScreen.js

import React, { useRef, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import LogoAres from "../assets/LogoAres.svg";
import Button   from "../components/Button";
import colors   from "../config/colors";

// Create an animated version of LinearGradient
const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const googleIcon   = require("../assets/Google.png");
const facebookIcon = require("../assets/Facebook.png");

export default function WelcomeScreen() {
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
    <View style={styles.container}>
      <AnimatedGradient
        colors={["#FFF7FA", "#F7F3F2", colors.background]}
        start={[0, 0]}
        end={[1, 1]}
        style={[StyleSheet.absoluteFill, { opacity: fade }]}
      />
      <View style={styles.background}>
        {/* Logo & tagline */}
        <View style={styles.logoContainer}>
          <LogoAres width={105} height={105} fill={colors.primary} />
          <Text style={styles.title}>Welcome to Ares</Text>
          <Text style={styles.subtitle}>We are ready to assist you!</Text>
        </View>

        {/* Social buttons */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={[styles.socialButton, styles.socialButtonBase]}>
            <Image source={googleIcon} style={styles.socialIcon} />
            <Text style={[styles.socialButtonText, { color: colors.dark }]}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, styles.socialButtonBase]}>
            <Image source={facebookIcon} style={styles.socialIcon} />
            <Text style={[styles.socialButtonText, { color: colors.dark }]}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.line, { backgroundColor: colors.light }]} />
          <Text style={[styles.orText, { color: colors.medium }]}>or</Text>
          <View style={[styles.line, { backgroundColor: colors.light }]} />
        </View>

        {/* Create account */}
        <View style={styles.createButtonContainer}>
          <Button title="Create account" color="createButton" />
        </View>

        {/* Login prompt */}
        <View style={[styles.loginPrompt, { marginBottom: Platform.OS === "android" ? 60 : 40 }]}>
          <Text style={[styles.loginText, { color: colors.onBackground }]}>Have an account already? </Text>
          <TouchableOpacity>
            <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: -10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.medium,
    marginTop: 4,
  },
  socialButtons: {
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    width: "80%",
  },
  socialButtonBase: {
    backgroundColor: null,
    borderColor: colors.light,
    borderWidth: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  socialButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    width: "80%",
  },
  line: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 12,
  },
  createButtonContainer: {
    marginBottom: 30,
    width: "80%",
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
  },
});