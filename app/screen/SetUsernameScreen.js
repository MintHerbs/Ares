// app/screens/SetUsernameScreen.js

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

import Logo        from "../assets/logo.svg";
import BookIcon    from "../assets/form icons/Book.svg";        // 📖 username icon

// validation schema for Formik using Yup
const validationSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
});

export default function SetUsernameScreen() {
  const [loading, setLoading] = useState(false);               // ⏳ track loading
  const [error, setError]     = useState("");                  // ❌ track error

  // called when form submits
  const handleCreateAccount = async (values) => {
    setError("");
    setLoading(true);
    try {
      // ← replace with your real API call
      await fakeCreateAccountApi(values.username);
      // on success navigate onwards...
    } catch {
      setError("Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios" 
            ? "padding" 
            : "height"
        }
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Screen>
            {/* ---------- Header ---------- */}
            <View style={styles.header}>
              <Logo width={105} height={105} fill={colors.logo} />
              <Text style={styles.title}>Username</Text>
              <Text style={styles.subtitle}>what should we call you?</Text>
            </View>

            {/* ---------- Form ---------- */}
            <View style={styles.formContainer}>
              <Formik
                initialValues={{ username: "" }}
                onSubmit={handleCreateAccount}                // 🔄 use our handler
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
                      icon={BookIcon}
                      placeholder="Username"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onBlur={() => {
                        setFieldTouched("username");
                      }}
                      onChangeText={handleChange("username")}
                    />
                    <ErrorMessage
                      error={errors.username}
                      visible={touched.username}
                    />

                    <ErrorMessage
                      error={error}                           // 🔄 show API error
                      visible={!!error}
                    />

                    <View style={styles.buttonWrapper}>
                      <Button
                        title="Create account"
                        color="createButton"
                        onPress={handleSubmit}
                        loading={loading}               // 🔄 show loader in button
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

// dummy API stub
async function fakeCreateAccountApi(username) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      username.length > 3 ? res() : rej();
    }, 1200);
  });
}

const styles = StyleSheet.create({
  header: {
    alignItems:   "center",
    marginTop:    80,
    marginBottom: 40,
  },
  title: {
    fontSize:   32,
    fontWeight: "700",
    color:      colors.onBackground,
    marginTop:  12,
  },
  subtitle: {
    fontSize:     20,
    fontWeight:   "600",
    color:        colors.onBackground,
    marginTop:    6,
    marginBottom: 60,
  },
  formContainer: {
    width:     "80%",
    alignSelf: "center",
    marginTop:  -80,
  },
  buttonWrapper: {
    marginTop: 25,
  },
});