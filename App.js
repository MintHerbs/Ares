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

export default function App() {
  return (
    <NavigationContainer>
       <PageNavigator />
    </NavigationContainer>
  );
  // //  <LoginScreen />
  // return <MapHomeScreen/>
}