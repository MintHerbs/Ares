// app/screens/RegisterScreen.js
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
import colors             from "../config/colors";
import ErrorMessage       from "../components/ErrorMessage";

import Logo            from "../assets/logo.svg";
import PersonIcon      from "../assets/form icons/User.svg";
import EmailIcon       from "../assets/form icons/Email.svg";
import PasswordIcon    from "../assets/form icons/Password.svg";
import CalenderIcon    from "../assets/form icons/Calendar.svg";
const ArrowIcon = require("../assets/form icons/Arrow.png");   // ⭐ PNG arrow

const validationSchema = Yup.object().shape({
  name:        Yup.string().required().label("Name"),
  email:       Yup.string().required().email().label("Email"),
  password:    Yup.string().required().min(4).label("Password"),
  dateOfBirth: Yup.string().required().label("Date of Birth"),
});

function RegisterScreen() {
  const [offset, setOffset] = useState(0);

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : offset === 0
              ? "height"
              : "position"
        }
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : offset}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <Screen>
            <View style={styles.header}>
              <Logo width={105} height={105} fill={colors.logo} />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Welcome</Text>
            </View>

            <View style={styles.formContainer}>
              <Formik
                initialValues={{ name: "", email: "", password: "", dateOfBirth: "" }}
                onSubmit={(values) => console.log(values)}
                validationSchema={validationSchema}
              >
                {({
                  handleChange,
                  handleSubmit,
                  errors,
                  setFieldTouched,
                  touched,
                }) => (
                  <>
                    {/* Name */}
                    <AppTextInput
                      icon={PersonIcon}
                      placeholder="Name"
                      onBlur={() => { setFieldTouched("name"); setOffset(0); }}
                      onFocus={() => setOffset(0)}
                      onChangeText={handleChange("name")}
                    />
                    <ErrorMessage error={errors.name} visible={touched.name} />

                    {/* Email */}
                    <AppTextInput
                      icon={EmailIcon}
                      placeholder="Email"
                      onBlur={() => { setFieldTouched("email"); setOffset(0); }}
                      onFocus={() => setOffset(0)}
                      onChangeText={handleChange("email")}
                    />
                    <ErrorMessage error={errors.email} visible={touched.email} />

                    {/* Password */}
                    <AppTextInput
                      icon={PasswordIcon}
                      placeholder="Password"
                      secureTextEntry
                      onBlur={() => { setFieldTouched("password"); setOffset(0); }}
                      onFocus={() => setOffset(-100)}
                      onChangeText={handleChange("password")}
                    />
                    <ErrorMessage error={errors.password} visible={touched.password} />

                    {/* Date of Birth */}
                    <AppTextInput
                      icon={CalenderIcon}
                      placeholder="Date of Birth"
                      onBlur={() => { setFieldTouched("dateOfBirth"); setOffset(0); }}
                      onFocus={() => setOffset(-100)}
                      onChangeText={handleChange("dateOfBirth")}
                    />
                    <ErrorMessage error={errors.dateOfBirth} visible={touched.dateOfBirth} />

                    <View style={styles.buttonWrapper}>
                      <Button
                        title="Next"
                        color="createButton"
                        onPress={handleSubmit}
                        icon={ArrowIcon}      
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

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 40,
    top: 80,
  },
  formContainer: {
    width: "80%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.onBackground,
    marginTop: 10,
  },
  subtitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: 23,
    color: colors.onBackground,
    fontWeight: "650",
    marginBottom: 50,
  },
  buttonWrapper: {
    marginTop: 15,
  },
});

export default RegisterScreen;
