// app/components/AuthScreenLayout.js

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import LogoAres from "./assets/LogoAres.svg";
import colors   from "./config/colors";

export default function AuthScreenLayout({ title, subtitle, children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#FFF7FA", "#F7F3F2", colors.background]}
        style={styles.background}
      >
        <View style={styles.logoContainer}>
          <LogoAres width={100} height={100} fill={colors.primary} />
          {title  && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {children}

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:   { flex: 1 },
  background: { flex: 1, justifyContent: "flex-end", alignItems: "center" },
  logoContainer: {
    position: "absolute",
    top:      80,
    alignItems: "center",
  },
  title:    { fontSize: 28, fontWeight: "700", marginTop: 20 },
  subtitle: { fontSize: 16, color: colors.medium, marginTop: 4 },
});

