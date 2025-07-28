import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';

// Import your PNG files
const ChatIcon = require('../assets/chat/Chat.png');
const VoiceIcon = require('../assets/chat/Voice.png');

const Toggle = ({
  selectionMode = 1,
  onSelectSwitch,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);

  const updatedSwitchData = val => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  return (
    <View style={{backgroundColor: 'black'}}> {/* Temporary black background for visibility */}
      <View
        style={{
          height: 44,
          width: 215,
          backgroundColor: 'rgba(255, 255, 255, 0.13)',
          borderRadius: 25,
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 2,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          style={{
            flex: 1,
            backgroundColor: getSelectionMode == 1 ? 'rgba(255, 255, 255, 0.09)' : 'transparent',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image source={ChatIcon} style={{width: 20, height: 20}} />
          {getSelectionMode == 1 && (
            <Text
              style={{
                color: 'white',
                marginLeft: 8,
                fontSize: 16,
                fontWeight: '500',
              }}>
              Chat
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(2)}
          style={{
            flex: 1,
            backgroundColor: getSelectionMode == 2 ? 'rgba(255, 255, 255, 0.09)' : 'transparent',
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image source={ChatIcon} style={{width: 20, height: 20}} />
          <Image source={VoiceIcon} style={{width: 20, height: 20, marginLeft: 8}} />
          {getSelectionMode == 2 && (
            <Text
              style={{
                color: 'white',
                marginLeft: 8,
                fontSize: 16,
                fontWeight: '500',
              }}>
              Voice
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Toggle;
