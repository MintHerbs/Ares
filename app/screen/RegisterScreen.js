// app/screens/RegisterScreen.js
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert, // Shows registration success/error messages
} from "react-native";
import { Formik } from "formik"; //handels state validation and submission of the form
import * as Yup from "yup"; // Yup is a JavaScript schema builder for value parsing and validation

import Screen             from "../components/Screen";
import GradientBackground from "../components/GradientBackground";
import AppTextInput       from "../components/AppTextInput";
import Button             from "../components/Button";
import colors             from "../config/colors";
import ErrorMessage       from "../components/ErrorMessage";

// This is the main Supabase client that handles all authentication operations
import { supabase }       from "../lib/supabase"; //Import your configured supabase client

import Logo            from "../assets/logo.svg";
import PersonIcon      from "../assets/form icons/User.svg";
import EmailIcon       from "../assets/form icons/Email.svg";
import PasswordIcon    from "../assets/form icons/Password.svg";
import CalenderIcon    from "../assets/form icons/Calendar.svg";
const ArrowIcon = require("../assets/form icons/Arrow.png");  

// These are our form validation rules using Yup library
const validationSchema = Yup.object().shape({
  name:        Yup.string().required().label("Name"),
  email:       Yup.string().required().email().label("Email"),
  password:    Yup.string().required().min(4).label("Password"),
  dateOfBirth: Yup.string().required().label("Date of Birth"),
});

function RegisterScreen() {
  // These handle keyboard offset for different input fields
  const [offset, setOffset] = useState(0);
  // This state tracks when we're communicating with Supabase server
  const [loading, setLoading] = useState(false); // Loading state for Supabase operations

  /* ========================================================================
   * SUPABASE REGISTRATION HANDLER - This is the main function that handles
   * user registration by communicating with Supabase authentication service
   * ======================================================================== */
  // SUPABASE INTEGRATION: Main registration handler
  // This function replaces the simple console.log and handles Supabase authentication

  const onSubmit = async (values, { setSubmitting, setFieldError }) => {
    // Extract form values from Formik
    const { name, email, password, dateOfBirth } = values;

    // Simple validation check before hitting Supabase
    // VALIDATION: Check all fields are filled (replacing the ref-based validation)
    if (!name.trim() || !email.trim() || !password.trim() || !dateOfBirth.trim()) {
      Alert.alert('Sign Up', "Please fill all the fields!");
      setSubmitting(false);
      return;
    }

    // Set loading states to prevent multiple submissions and show user feedback
    // LOADING STATES: Set loading states for UI feedback
    setLoading(true);
    setSubmitting(true);

    try {
      /* ===================================================================
       * MAIN SUPABASE AUTHENTICATION CALL - This is where we actually
       * create the user account in Supabase's authentication system
       * =================================================================== */
      

      const { data: { session }, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            // Store extra user info in Supabase user metadata (not in auth table but in user_metadata)
            //USER METADATA: Store additional user info in Supabase user metadata
            name: name.trim(),
            date_of_birth: dateOfBirth.trim(),
          }
        }
      });

      /* ===================================================================
       * SUPABASE RESPONSE LOGGING - Debug information for developers
       * =================================================================== */
      //  CONSOLE LOGGING: Detailed logging for debugging (will appear in VS Code terminal)
      console.log('=== SUPABASE REGISTRATION ATTEMPT ===');
      console.log('session: ', session);
      console.log('error: ', error);
      console.log('user data: ', { name: name.trim(), email: email.trim(), dateOfBirth: dateOfBirth.trim() });

      /* ===================================================================
       * SUPABASE ERROR HANDLING - Handle different types of auth errors
       * =================================================================== */
      // ERROR HANDLING: Handle Supabase authentication errors
      if (error) {
        Alert.alert('Sign Up Error', error.message);
        // Try to map specific Supabase errors to the correct form fields
        //FIELD-SPECIFIC ERRORS: Map Supabase errors to specific form fields
        if (error.message.toLowerCase().includes('email')) {
          setFieldError('email', error.message);
        } else if (error.message.toLowerCase().includes('password')) {
          setFieldError('password', error.message);
        }
      } else {
        /* ===============================================================
         * SUCCESSFUL SUPABASE REGISTRATION - User account was created
         * =============================================================== */
        // SUCCESS HANDLING: Registration successful
        Alert.alert(
          'Registration Successful!', 
          'Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => {
                // This is where you'd typically navigate to login or email verification screen
                //Add navigation logic here (e.g., navigate to login or email verification)
                console.log('User registered successfully, redirecting...');
              }
            }
          ]
        );
      }
    } catch (err) {
      // Handle any network errors or other unexpected issues with Supabase
      //UNEXPECTED ERROR HANDLING: Catch any network or other unexpected errors
      console.log('Unexpected error during registration:', err);
      Alert.alert('Sign Up Error', 'An unexpected error occurred. Please try again.');
    } finally {
      // Always reset loading states regardless of success or failure
      
      setLoading(false);
      setSubmitting(false);
    }
  };

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
                onSubmit={onSubmit} //Now uses our Supabase-integrated onSubmit function
                validationSchema={validationSchema}
              >
                {({
                  handleChange,
                  handleSubmit,
                  errors,
                  setFieldTouched,
                  touched,
                  isSubmitting, //FORMIK STATE: Used to disable button during submission
                  setFieldError, //FORMIK HELPER: Used to set field-specific errors from Supabase
                }) => (
                  <>
                    {/* Name */}
                    <AppTextInput
                      icon={PersonIcon}
                      placeholder="Name"
                      onBlur={() => { setFieldTouched("name"); setOffset(0); }}
                      onFocus={() => setOffset(0)}
                      onChangeText={handleChange("name")}
                      editable={!loading} //  UI STATE: Disable input during Supabase operations
                    />
                    <ErrorMessage error={errors.name} visible={touched.name} />

                    {/* Email */}
                    <AppTextInput
                      icon={EmailIcon}
                      placeholder="Email"
                      keyboardType="email-address" 
                      autoCapitalize="none" 
                      onBlur={() => { setFieldTouched("email"); setOffset(0); }}
                      onFocus={() => setOffset(0)}
                      onChangeText={handleChange("email")}
                      editable={!loading}
                    />
                    <ErrorMessage error={errors.email} visible={touched.email} />

                    {/* Password */}
                    <AppTextInput
                      icon={PasswordIcon}
                      placeholder="Password"
                      secureTextEntry
                      autoCapitalize="none" 
                      onBlur={() => { setFieldTouched("password"); setOffset(0); }}
                      onFocus={() => setOffset(-100)}
                      onChangeText={handleChange("password")}
                      editable={!loading} 
                    />
                    <ErrorMessage error={errors.password} visible={touched.password} />

                    {/* Date of Birth */}
                    <AppTextInput
                      icon={CalenderIcon}
                      placeholder="Date of Birth (MM/DD/YYYY)" 
                      onBlur={() => { setFieldTouched("dateOfBirth"); setOffset(0); }}
                      onFocus={() => setOffset(-100)}
                      onChangeText={handleChange("dateOfBirth")}
                      editable={!loading} 
                    />
                    <ErrorMessage error={errors.dateOfBirth} visible={touched.dateOfBirth} />

                    <View style={styles.buttonWrapper}>
                      <Button
                        title={loading ? "Creating Account..." : "Register"} 
                        color="createButton"
                        onPress={handleSubmit}
                        icon={ArrowIcon}
                        disabled={loading || isSubmitting} 
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