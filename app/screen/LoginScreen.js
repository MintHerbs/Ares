// app/screens/LoginScreen.js

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import Screen             from "../components/Screen";
import GradientBackground from "../components/GradientBackground";
import AppTextInput       from "../components/AppTextInput";
import Button             from "../components/Button";
import ErrorMessage       from "../components/ErrorMessage";
import colors             from "../config/colors";

import Logo            from "../assets/logo.svg";
import EmailIcon       from "../assets/form icons/Email.svg";
import PasswordIcon    from "../assets/form icons/Password.svg";

// --- validation schema ---
const validationSchema = Yup.object().shape({
  email:    Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async (values) => {
    setError("");
    setLoading(true);
    try {
      // ← replace with your real login call
      await fakeLoginApi(values.email, values.password);
      // on success navigate away...
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Screen>
            {/* -------- Header -------- */}
            <View style={styles.header}>
              <Logo width={105} height={105} fill={colors.logo} />
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>Welcome Back!</Text>
            </View>

            {/* -------- Form -------- */}
            <View style={styles.formContainer}>
              <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={handleLogin}
                validationSchema={validationSchema}
              >
                {({
                  handleChange,
                  handleSubmit,
                  errors,
                  touched,
                  setFieldTouched,
                }) => (
                  <>
                    <AppTextInput
                      icon={EmailIcon}
                      placeholder="Email"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      onBlur={() => setFieldTouched("email")}
                      onChangeText={handleChange("email")}
                    />
                    <ErrorMessage
                      error={errors.email}
                      visible={touched.email}
                    />

                    <AppTextInput
                      icon={PasswordIcon}
                      placeholder="Password"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="password"
                      onBlur={() => setFieldTouched("password")}
                      onChangeText={handleChange("password")}
                    />
                    <ErrorMessage
                      error={errors.password}
                      visible={touched.password}
                    />

                    <ErrorMessage error={error} visible={!!error} />

                    <View style={styles.buttonWrapper}>
                      <Button
                        title="Login"
                        color="createButton"
                        onPress={handleSubmit}
                        loading={loading}
                      />
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </Screen>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

// dummy API for demo
async function fakeLoginApi(email, pass) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      email === "you@here.com" && pass === "pass123"
        ? res()
        : rej();
    }, 1500);
  });
}

const styles = StyleSheet.create({
  header: {
    alignItems:   "center",
    marginTop:    80,     // 🔄 replaced top:80 with marginTop
    marginBottom: -10,
  },
  title: {
    fontSize:   28,
    fontWeight: "700",
    color:      colors.onBackground,
    marginTop:  10,      // 🔄 replaced negative with positive spacing
  },
  subtitle: {
    fontFamily:   "Inter, sans-serif",
    fontSize:     23,
    fontWeight:   "650", 
    color:        colors.onBackground,
    marginBottom: 30,
  },
  formContainer: {
    width:     "80%",
    alignSelf: "center",
  },
  buttonWrapper: {
    marginTop: 15,
  },
});
