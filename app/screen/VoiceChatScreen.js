
// app/screens/VoiceChatScreen.js

import React, { useState } from "react"
import { StyleSheet, TouchableOpacity, View, ImageBackground, Image } from "react-native"
import Screen from "../components/Screen"
import CircularButton from "../components/chat/CircularButton"
import ModeToggle from "../components/chat/ModeToggle"

function VoiceChatScreen() {
  const [isRecording, setIsRecording] = useState(false)
  const [selectedMode, setSelectedMode] = useState('voice') // 'chat' or 'voice'

  const handleBackPress = () => {
    console.log("Back button pressed")
    // TODO: Add navigation back logic
    // navigation.goBack()
  }

  const handleGhostPress = () => {
    console.log("Ghost button pressed")
    // TODO: Add ghost functionality
  }

  const handleModeToggle = (mode) => {
    setSelectedMode(mode)
    console.log(`Mode switched to: ${mode}`)
  }

  const handleMicrophonePress = () => {
    setIsRecording(!isRecording)
    console.log(`Microphone ${isRecording ? 'stopped' : 'started'} recording`)
    // TODO: Add voice recording logic
  }

  const handleMessagePress = () => {
    console.log("Message button pressed")
    // TODO: Add message functionality
  }

  const handleExitPress = () => {
    console.log("Exit button pressed")
    // TODO: Add exit functionality
  }

  return (
   
      <ImageBackground
        source={require("../assets/AiChat/ChatBG.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
         <Screen style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Image 
              source={require("../assets/AiChat/Vector.png")}
              style={styles.BackIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <ModeToggle 
            selectedMode={selectedMode}
            onModeChange={handleModeToggle}
          />

          <TouchableOpacity
            onPress={handleGhostPress}
            activeOpacity={0.7}
          >
            <Image 
              source={require("../assets/AiChat/Ghost.png")}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Voice visualization or chat content would go here */}
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <CircularButton
            iconSource={require("../assets/AiChat/Message icon.png")}
            onPress={handleMessagePress}
            size={50}
            iconSize={20}
          />

          <CircularButton
            iconSource={require("../assets/AiChat/Exit.png")}
            onPress={handleExitPress}
            size={50}
            iconSize={20}
          />
        </View>

        {/* Microphone Button (Elevated) */}
        <View style={styles.microphoneContainer}>
          <CircularButton
            iconSource={require("../assets/AiChat/Microphone.png")}
            onPress={handleMicrophonePress}
            size={80}
            iconSize={35}
            isActive={isRecording}
            activeColor="#FF6B6B"
          />
        </View>
      
    </Screen>
    </ImageBackground>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  BackIcon: {
    width: 17,
    height: 17,

  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 120, // Space for elevated microphone button
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
  },
  microphoneContainer: {
    position: 'absolute',

    bottom: 130,
    left: '50%',
    marginLeft: -40, // Half of button width to center
    zIndex: 10,
  },
})

export default VoiceChatScreen