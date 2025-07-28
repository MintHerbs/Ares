// app/components/NewsCard.js

import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import colors from "../config/colors";

export default function NewsCard({ title, timeUpload }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/test2jpg.jpg")}
          style={styles.image}
        />
        <TouchableOpacity style={styles.bookmarkButton}>
          <Image
            source={require("../assets/icons/bookmark.png")}
            style={styles.bookmarkIcon}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.footer}>
        <View style={styles.publisher}>
          <Image
            source={require("../assets/bbcNews.jpg")}
            style={styles.publisherAvatar}
          />
          <View style={styles.publisherText}>
            <Text style={styles.publisherName}>BBC News</Text>
            <Text style={styles.publisherTime}>
              {timeUpload} Hours ago
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagText}>Finance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: "hidden",
    margin: 16,
    elevation: 3,              // Android shadow
    shadowColor: "#000",       // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  imageWrapper: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 180,
  },

  bookmarkButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 16,
    padding: 6,
  },
  bookmarkIcon: {
    width: 20,
    height: 20,
    tintColor: colors.dark,   // ensure the icon matches theme
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark,
    marginHorizontal: 12,
    marginVertical: 12,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginBottom: 12,
  },

  publisher: {
    flexDirection: "row",
    alignItems: "center",
  },
  publisherAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  publisherText: {
    marginLeft: 8,
  },
  publisherName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.dark,
  },
  publisherTime: {
    fontSize: 12,
    color: colors.medium,
  },

  tag: {
    borderWidth: 1,
    borderColor: colors.dark,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
    color: colors.dark,
  },
});
