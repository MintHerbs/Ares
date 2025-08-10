import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';


const UserDetailsScreen = () => {


  return (
    <View style={styles.container}>
    
      <Text style={styles.temp}>ur gae</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    temp: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'red'
    },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    
  },

});

export default UserDetailsScreen;
