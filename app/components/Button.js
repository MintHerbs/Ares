// app/components/Button.js

import React from "react"
import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native"
import colors from "../config/colors"
import LoadingIndicator from "./LoadingIndicator"

function Button({ title, onPress, color = "primary", icon, loading = false }) {
  return (
    <TouchableOpacity
      disabled={loading}
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      {loading
        ? <LoadingIndicator size={18} />
        : <>
            <Text style={styles.text}>{title}</Text>
            {icon && typeof icon === "number"
              ? <Image source={icon} style={styles.icon} />
              : icon
                ? <View style={styles.svgIconWrapper}>
                    {React.createElement(icon, { width: 24, height: 24 })}
                  </View>
                : null
            }
          </>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: "relative",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%"
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24
  },
  icon: {
    marginLeft: 10,
    width: 20,
    height: 20,
    resizeMode: "contain"
  },
  svgIconWrapper: {
    position: "absolute",
    right: 20,
    top: "50%",
    marginTop: -12
  }
})

export default Button
