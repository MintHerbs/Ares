import React from 'react';
import AiLandingPage from './app/screen/AiLandingPage';
import VoiceChatScreen from './app/screen/VoiceChatScreen';
import WelcomeScreen from './app/screen/WelcomeScreen';
import CurrencyConvertor from './app/screen/CurrencyConvertor';
import LoginScreen from './app/screen/LoginScreen';
import PageNavigator from './app/navigation/PageNavigator';
import NearbyPlaces from './app/screen/journey';
import { NavigationContainer } from '@react-navigation/native';
import MapHomeScreen from './app/screen/MapHomeScreen';
import AppNavigator from './app/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
       <AppNavigator />
    </NavigationContainer>
  );
  // //  <LoginScreen />
  // return <MapHomeScreen/>
}