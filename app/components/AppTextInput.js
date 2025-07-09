// app/components/AppTextInput.js

import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import colors from "../config/colors";

import EyeIcon      from "../assets/form icons/eye.svg";
import EyeSlashIcon from "../assets/form icons/eye-slash.svg";

function AppTextInput({ icon: Icon, width = "100%", ...otherProps }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hidden, setHidden]       = useState(!!otherProps.secureTextEntry);

  return (
    <View
      style={[
        styles.container,
        {
          width,
          borderColor: isFocused ? colors.formBorderActive : colors.formBorder,
        },
      ]}
    >
      {/* leading icon */}
      {Icon && (
        <View style={styles.iconWrapper}>
          <Icon width={22} height={22} />
        </View>
      )}

      {/* text field */}
      <TextInput
        style={[
          styles.text,
          otherProps.secureTextEntry && { paddingRight: 40 }, // 🔄 add space for eye
        ]}
        placeholderTextColor={colors.formBorder}
        {...otherProps}              // 🔄 moved BEFORE secureTextEntry to keep toggle
        secureTextEntry={hidden}     // binds eye-toggle state
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* eye icon: toggle password visibility */}
      {otherProps.secureTextEntry && (
        <TouchableOpacity
          style={styles.eyeWrapper}
          onPress={() => setHidden(!hidden)}
        >
          {hidden ? (
            <EyeSlashIcon width={22} height={22} />
          ) : (
            <EyeIcon width={22} height={22} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   "row",
    alignItems:      "center",
    borderRadius:    18,
    borderWidth:     1.9,
    backgroundColor: null,
    paddingHorizontal: 8,
    paddingVertical:   8,
    marginVertical:    10,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  eyeWrapper: {
    position: "absolute",
    right: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    flex: 1,
    fontSize: 17,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    color: colors.dark,
  },
});

export default AppTextInput;
