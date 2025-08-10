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


import { useNavigation } from "@react-navigation/native";
import VoiceChatScreen from "./VoiceChatScreen.js";


// Supabase client (configured in ../lib/supabase). This gives us auth methods.
import { supabase }    from "../lib/supabase";

// --- validation schema ---
const validationSchema = Yup.object().shape({
  email:    Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});





export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const navigation = useNavigation();


  
  const createAcc = async () => {
    const { data, error } = await supabase.auth.signUp({
          email: 'appcup2026@gmail.com', //change as needed
          password: 'OLSPD!',  //parei
        });
        
        if (error) {
          console.log('Signup failed:', error.message);
        } else {
          console.log('Signup success:', data);
        }
  }


  const handleLogin = async (values) => {
    setError("");
    setLoading(true);
      
    //? Uncomment if u need to create another user account in supabase
    // createAcc();

    try {
      
      
      

      // Call Supabase Auth v2 method. This returns { data: { user, session }, error }.
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password.trim(),
      });

      if (signInError) {
        // Any auth failure (wrong password, unconfirmed email, etc.) ends up here.
        setError(signInError.message);
      } else {
        const { user, session } = data;
        console.log("Signed in user:", user);
        console.log("Session:", session);
        // At this point the user is authenticated.
        // Replace the console.log with your navigation logic, for example:
        // navigation.navigate("Home");
        // or update some global auth state/context.

        navigation.replace("UserDetailsScreen"); 
      }
    } catch (err) {
      // Catch unexpected network or library errors that are not normal auth errors.
      setError("Unexpected login error");
      console.error("Login exception:", err);
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

const styles = StyleSheet.create({
  header: {
    alignItems:   "center",
    marginTop:    80,
    marginBottom: -10,
  },
  title: {
    fontSize:   28,
    fontWeight: "700",
    color:      colors.onBackground,
    marginTop:  10,
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
