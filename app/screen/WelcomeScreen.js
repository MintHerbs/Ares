// app/screens/WelcomeScreen.js

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoAres      from "../assets/LogoAres.svg";
import Button        from "../components/Button";
import SocialButton  from "../components/SocialButton";
import GradientBackground from "../components/GradientBackground";
import colors        from "../config/colors";

function WelcomeScreen(props) {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <GradientBackground>
        <View style={styles.background}>
          {/* Logo and tagline */}
          <View style={styles.logoContainer}>
            <LogoAres width={105} height={105} fill={colors.primary} />
            <Text style={styles.title}>Welcome to Ares</Text>
            <Text style={styles.subtitle}>We are ready to assist you!</Text>
          </View>

          {/* Social buttons */}
          <View style={styles.socialButtons}>
            <SocialButton
              icon={require("../assets/Google.png")}
              title="Continue with Google"
            />
            <SocialButton
              icon={require("../assets/Facebook.png")}
              title="Continue with Facebook"
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.line} />
          </View>

          {/* Create account */}
          <View style={styles.createButtonContainer}>
            <Button title="Create account" color="createButton" />
          </View>

          {/* Login prompt */}
          <View
            style={[
              styles.loginPrompt,
              { marginBottom: Platform.OS === "android" ? 20 : 10 },
            ]}
          >
            <Text style={styles.loginText}>Have an account already? </Text>
            <TouchableOpacity>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 80,
    alignItems: "center",
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: -10,
    color: colors.onBackground,
  },
  subtitle: {
    fontSize: 16,
    color: colors.medium,
    marginTop: 4,
  },
  socialButtons: {
    width: "80%",
    alignItems: "center",
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
    backgroundColor: colors.light,
  },
  orText: {
    marginHorizontal: 12,
    color: colors.medium,
  },
  createButtonContainer: {
    marginBottom: 20,
    width: "80%",
  },
  loginPrompt: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    fontSize: 14,
    color: colors.onBackground,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});

export default WelcomeScreen;
