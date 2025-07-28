// app/components/AiLandingPage/AppList.js

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // for the button background effect
import colors from "../../config/colors";
// Pull in our Supabase client so we can load real chat history
import { supabase } from "../../lib/supabase";

function AppList() {
  // this will hold the rows we fetch from our "Chat History" table
  const [chatSessions, setChatSessions] = useState([]);
  // track which item is currently pressed, so we can give touch feedback
  const [pressedItem, setPressedItem] = useState(null);

  useEffect(() => {
    // load the user's chat history once on mount
    async function fetchChatSessions() {
      try {
        // grab id and title from every row, sorted newest first
        const { data, error } = await supabase
          .from("Chat History")
          .select("id, title")
          .order("created_at", { ascending: false });

        if (error) {
          // if something goes wrong at the database level, log it
          console.log("Error loading chat history:", error.message);
        } else {
          // save the returned array into state so FlatList can render it
          setChatSessions(data);
        }
      } catch (err) {
        // catch any other unexpected errors (network, JSON parse, etc.)
        console.log("Unexpected fetch error:", err);
      }
    }

    fetchChatSessions();
  }, []); // empty array = run only once

  const handlePressIn  = (itemId) => setPressedItem(itemId);
  const handlePressOut = () => setPressedItem(null);

  const handlePress = (item) => {
    // when a chat session card is tapped, we'll open that session
    console.log(`Chat session pressed: ${item.title}`);
    // e.g. navigation.navigate("ChatScreen", { sessionId: item.id });
  };

  const renderChatItem = ({ item }) => {
    const isPressed = pressedItem === item.id;

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => handlePressIn(item.id)}
          onPressOut={handlePressOut}
          onPress={() => handlePress(item)}
          activeOpacity={1}
        >
          {/* soft gradient background for each session button */}
          <LinearGradient
            colors={[
              "rgba(165, 190, 217, 0.19)",
              isPressed
                ? "rgba(63, 77, 88, 0.23)"
                : "rgba(63, 77, 88, 0.36)",
            ]}
            locations={[0, 1]}
            start={{ x: 0.3, y: 0.1 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <Text style={styles.buttonText}>{item.title}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatSessions}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 270,           // keep list a bit narrower than the New Chat button
    alignSelf: "center",  // center the list under the header/button
    paddingTop: 20,       // some space before the first item
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 12,
  },
  button: {
    width: "100%",
    height: 61,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#40474F",
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default AppList;
