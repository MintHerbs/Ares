import React from "react";
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import FeedNavigator from "./FeedNavigator";
import ListingEditScreen from "../screens/ListingEditScreen";
import AccountNavigator from "./AccountNavigator";
import colors from "../config/colors";

// Import your SVG icons
import HouseActive from "../assets/icons/House_active.svg";
import HouseInactive from "../assets/icons/House_inactive.svg";
import SearchActive from "../assets/icons/Search_Active.svg";
import SearchInactive from "../assets/icons/Search_inactive.svg";
import AgentActive from "../assets/icons/Agent_Active.svg";
import AgentInactive from "../assets/icons/Agent_inactive.svg";
import ChatActive from "../assets/icons/Chat_Active.svg";
import ChatInactive from "../assets/icons/Chat_inactive.svg";
import PersonActive from "../assets/icons/Person_Active.svg";
import PersonInactive from "../assets/icons/Person_inactive.svg";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <SafeAreaView style={styles.screen}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,

          // Remove ripple effect on press and use fade
          tabBarButton: (props) => (
            <TouchableOpacity {...props} activeOpacity={0.7} />
          ),

          // Custom tab bar styling
          tabBarStyle: [
            styles.tabBar,
            {
              height: Platform.OS === "ios" ? 100 : 80,
            },
          ],
        }}
      >
        {/* Feed */}
        <Tab.Screen
          name="Feed"
          component={FeedNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.iconWrapper,
                  focused && styles.iconWrapperActive,
                ]}
              >
                {focused ? <HouseActive width={24} height={24} /> : <HouseInactive width={24} height={24} />}
              </View>
            ),
          }}
        />

        {/* Search */}
        <Tab.Screen
          name="Search"
          component={FeedNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.iconWrapper,
                  focused && styles.iconWrapperActive,
                ]}
              >
                {focused ? <SearchActive width={24} height={24} /> : <SearchInactive width={24} height={24} />}
              </View>
            ),
          }}
        />

        {/* Agent */}
        <Tab.Screen
          name="Agent"
          component={ListingEditScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.iconWrapper,
                  focused && styles.iconWrapperActive,
                ]}
              >
                {focused ? <AgentActive width={24} height={24} /> : <AgentInactive width={24} height={24} />}
              </View>
            ),
          }}
        />

        {/* Chat */}
        <Tab.Screen
          name="Chat"
          component={ListingEditScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.iconWrapper,
                  focused && styles.iconWrapperActive,
                ]}
              >
                {focused ? <ChatActive width={24} height={24} /> : <ChatInactive width={24} height={24} />}
              </View>
            ),
          }}
        />

        {/* Account */}
        <Tab.Screen
          name="Account"
          component={AccountNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  styles.iconWrapper,
                  focused && styles.iconWrapperActive,
                ]}
              >
                {focused ? <PersonActive width={24} height={24} /> : <PersonInactive width={24} height={24} />}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 20,
  },
  iconWrapperActive: {
    backgroundColor: "#D7E2FB",   // pill highlight
    paddingHorizontal: 12,        // wider for pill look
    paddingVertical: 6,           // tighter vertically
    borderRadius: 30,             // full rounded shape
    alignItems: "center",         // center icon inside pill
    justifyContent: "center",
  },
});
