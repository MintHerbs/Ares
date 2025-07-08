// app/screens/LoginScreen.js

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import Screen             from "../components/Screen";
import GradientBackground from "../components/GradientBackground";
import AppTextInput       from "../components/AppTextInput";
import Button             from "../components/Button";
import colors             from "../config/colors";
import ErrorMessage       from "../components/ErrorMessage";

import Logo         from "../assets/logo.svg";
import EmailIcon    from "../assets/form icons/Email.svg";
import PasswordIcon from "../assets/form icons/Password.svg";

// validation schema for Formik using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen() {
  return (
    <GradientBackground>
      <Screen>
        <View style={styles.header}>
          <Logo width={105} height={105} bottom={35} fill={colors.logo} />
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
        </View>

        <View style={styles.formContainer}>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => console.log(values)}
            validationSchema={validationSchema}
          >
            {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
              <>
                <AppTextInput
                  icon={EmailIcon}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  onBlur ={()=> setFieldTouched("email")}
                  onChangeText={handleChange("email")}
                />

                <ErrorMessage error={errors.email} visible={touched.email} />

                <AppTextInput
                  icon={PasswordIcon}
                  placeholder="Password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  onBlur ={()=> setFieldTouched("password")}
                  onChangeText={handleChange("password")}
                />

                <ErrorMessage error={errors.password} visible={touched.password} />

                {/* wrapper view adds spacing around the button */}
                <View style={styles.buttonWrapper}>
                  <Button
                    title="Login"
                    color="createButton"
                    onPress={handleSubmit}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </Screen>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 40,
    top: 80, // relative offset to move header down without affecting inputs
  },
  formContainer: {
    width: "80%",
    alignSelf: "center",
  },
  title: {
    fontSize: 28, // adjusted to match mockup font size
    fontWeight: "700",
    color: colors.onBackground,
    marginTop: -30,
  },
  subtitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: 23,
    color: colors.onBackground,
    fontWeight: "650", // semi bold
    marginBottom: 50,
  },
  buttonWrapper: {
    marginTop: 15, // space between password input and login button
  },
});

export default LoginScreen;
