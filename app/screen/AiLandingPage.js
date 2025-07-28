// app/screens/AiLandingPage.js

import React, { useState, useEffect } from "react";           // added hooks
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image
} from "react-native";

// bring in our Supabase client so we can query the "Chat History" table
import { supabase } from "../lib/supabase";

import Screen from "../components/Screen";
import NewChatButton from "../components/AiLandingPage/newChatButton";
// pass the fetched sessions into AppList
import AppList from "../components/AiLandingPage/AppList";
import colors from "../config/colors";

export default function AiLandingPage() {
  // holds the list of previous chat headers
  const [chatSessions, setChatSessions] = useState([]);

  useEffect(() => {
    // load chat history once when the screen appears
    async function loadChatHistory() {
      // grab every row from "Chat History" table
      let { data, error } = await supabase
        .from("Chat History")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // log to console so we can troubleshoot if something goes wrong
        console.log("Failed to load chat history:", error.message);
      } else {
        // stick the results into state so AppList can render them
        setChatSessions(data);
      }
    }

    loadChatHistory();
  }, []); // empty deps → run only once

  return (
    <ImageBackground
      source={require("../assets/chat/Background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Screen style={styles.screen}>
        <View style={styles.topSection}>
          <Image
            source={require("../assets/chat/Agent.png")}
            style={styles.agentImage}
          />
          <Text style={styles.title}>Synthetic Intelligence</Text>
          <Text style={styles.subtitle}>
            Please select how you{'\n'}would like to interact
          </Text>
          <NewChatButton />
        </View>

        {/* stays pinned above the scrolling list */}
        <View style={styles.historyHeaderContainer}>
          <Text style={styles.historyHeader}>Chat History</Text>
        </View>

        {/* hand off our freshly‑loaded sessions to the list component */}
        <View style={styles.listWrapper}>
          <AppList chatSessions={chatSessions} />
        </View>
      </Screen>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  topSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  agentImage: {
    width: 300,
    height: 300,
    marginBottom: -40,
    marginTop: -80,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 30,
    color: colors.white,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 20,
    color: colors.white,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  historyHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: -10,
    backgroundColor: null,
    zIndex: 1,
    paddingTop: -20,
  },
  historyHeader: {
    fontFamily: "Inter-SemiBold",
    fontSize: 19,
    color: "#A1A1A1",
  },
  listWrapper: {
    flex: 1,
    marginTop: -8,
    paddingHorizontal: 20,
  },
});
