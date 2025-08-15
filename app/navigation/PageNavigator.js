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
import Nationality from "../screen/Nationality"
import Restrictions from "../screen/Restrictions";
import UserInfo from "../screen/UserInfo";
import RegisterScreen from "../screen/RegisterScreen";
import MapHomeScreen from "../screen/MapHomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

export default function PageNavigator() {
return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Nationality" component={Nationality} />
      <Stack.Screen name="Restrictions" component={Restrictions} />
      <Stack.Screen name="MapHomeScreen" component={MapHomeScreen} />
    </Stack.Navigator>
  );
}