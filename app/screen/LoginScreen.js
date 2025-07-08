// app/screens/LoginScreen.js

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Formik } from "formik";

import Screen              from "../components/Screen";
import GradientBackground  from "../components/GradientBackground";
import AppTextInput        from "../components/AppTextInput";
import Button              from "../components/Button";
import colors              from "../config/colors";

import Logo      from "../assets/logo.svg";
import EmailIcon from "../assets/form icons/Email.svg";
import PasswordIcon from "../assets/form icons/Password.svg";

function LoginScreen(props) {
  return (
    <GradientBackground>
    <Screen>
      
        <View style={styles.header}>
          <Logo width={105} height={105} bottom={35} fill={colors.logo} />
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Welcome Back!</Text>
        </View>

        <View style={styles.formContainer}>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={values => console.log(values)}
          >
            {({ handleChange, handleSubmit }) => (
              <>
                <AppTextInput
                  icon={EmailIcon}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  onChangeText={handleChange("email")}
                />

                <AppTextInput
                  icon={PasswordIcon}
                  placeholder="Password"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  onChangeText={handleChange("password")}
                />

                <Button
                  title="Login"
                  color="createButton"
                  onPress={handleSubmit}
                />
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
    alignItems:   "center",
    marginBottom: 40,
    top:          80,   //relative offset to move header down without affecting inputs
  },
  formContainer: {
    width:     "80%",
    alignSelf: "center",
  },
  title: {
    fontSize:   28,     // adjusted to match mockup font size
    fontWeight: "700",
    color:      colors.onBackground,
    marginTop:  -30,
  },
  subtitle: {
  fontFamily:   'Inter, sans-serif',
  fontSize:     23,      
  color:        colors.onBackground,
  fontWeight:   '650',    // Semi Bold
  marginBottom: 50,
},
});

export default LoginScreen;
