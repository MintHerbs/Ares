// app/navigation/AppNavigator.js 
import React, { useEffect } from "react";
import { StyleSheet, Platform, SafeAreaView, TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from 'expo-notifications';

// SVG icons
import HouseActive from "../assets/icons/House_active.svg";
import HouseInactive from "../assets/icons/House_inactive.svg";
import SearchActive from "../assets/icons/Search_Active.svg";
import SearchInactive from "../assets/icons/Search_inactive.svg";
import AgentActive from "../assets/icons/Agent_Active.svg";
import AgentInactive from "../assets/icons/Agent_inactive.svg";
import ChatActive from "../assets/icons/Chat_Active.svg";
import ChatInactive from "../assets/icons/chat_inactive.svg";
import PersonActive from "../assets/icons/Person_Active.svg";
import PersonInactive from "../assets/icons/Person_inactive.svg";

import MapHomeScreen from "../screen/MapHomeScreen"; // ← NEW
import ImageReader from "../screen/ImageReader";
import NearbyPlaces from "../screen/journey";
import NewsScraper from "../screen/NewsScraper";

import { useNotificationNavigation } from '../hooks/useNotificationNavigation';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AgentScreen() { return <View style={styles.stub} />; }
function ChatScreen() { return <View style={styles.stub} />; }
function AccountScreen() { return <View style={styles.stub} />; }

function Tabs(){
  return (
    <SafeAreaView style={styles.screen}>
      <Tab.Navigator
        initialRouteName="Home"  // ← NEW (optional, keeps Home first anyway)
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarButton: (props) => <TouchableOpacity {...props} activeOpacity={0.7} />,
          tabBarStyle: [styles.tabBar, { height: Platform.OS === "ios" ? 100 : 80 }],
        }}
      >
        <Tab.Screen
          name="Home"
          component={MapHomeScreen}  // ← show your Map as the Home tab
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                {focused ? <HouseActive width={24} height={24} /> : <HouseInactive width={24} height={24} />}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={NearbyPlaces}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                {focused ? <SearchActive width={24} height={24} /> : <SearchInactive width={24} height={24} />}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Agent"
          component={NewsScraper}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                {focused ? <AgentActive width={24} height={24} /> : <AgentInactive width={24} height={24} />}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Chat"
          component={ImageReader}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                {focused ? <ChatActive width={24} height={24} /> : <ChatInactive width={24} height={24} />}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
                {focused ? <PersonActive width={24} height={24} /> : <PersonInactive width={24} height={24} />}
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default function AppNavigator() {
  useNotificationNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="NewsScraper" component={NewsScraper} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  screen: { flex: 1 },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    // Optional: slight elevation/shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  iconWrapper: { padding: 8, borderRadius: 20 },
  iconWrapperActive: {
    backgroundColor: "#D7E2FB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  stub: { flex: 1, backgroundColor: "#fff" },
});