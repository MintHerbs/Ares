import React from "react";
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import VoiceChatScreen from "../screen/VoiceChatScreen";
import LoginScreen from "../screen/LoginScreen";
import UserDetailsScreen from "../screen/UserDetailsScreen"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="Login" component={LoginScreen} />
      
        
      <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
      <Stack.Screen name="VoiceChatScreen" component={VoiceChatScreen} />
    </Stack.Navigator>
  );
}