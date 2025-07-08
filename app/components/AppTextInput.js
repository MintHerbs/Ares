import React, { useState } from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import colors from "../config/colors";

function AppTextInput({ icon: Icon, width = "100%", ...otherProps }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          width,
          borderColor: isFocused
            ? colors.formBorderActive   // dark border on focus
            : colors.formBorder,        // light grey by default
        },
      ]}
    >
      {Icon && (
        <View style={styles.iconWrapper}>
          {/* no fill so SVG’s own colour shows */}
          <Icon width={22} height={22} />
        </View>
      )}

      <TextInput
        style={styles.text}
        placeholderTextColor={colors.formBorder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...otherProps}
      />
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
    paddingVertical:   8,   // shorter height per mockup
    marginVertical:    10,
  },
  iconWrapper: {
    width:       32,
    height:      32,
    alignItems:  "center",
    justifyContent: "center",
    marginRight: 10,
  
  },
  text: {
    flex: 1,
    fontSize:   17,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    color:      colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AppTextInput;
