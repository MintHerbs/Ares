import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CountryPicker from 'react-native-country-picker-modal';

import Screen from "../components/Screen";

import Logo from "../assets/logo.svg";
import colors             from "../config/colors";
import Button             from "../components/Button";
import { useNavigation } from "@react-navigation/native";

const Nationality = () => {
  const [restriction, setRestriction] = useState('');
  const [preference, setPreference] = useState('');
    const navigation = useNavigation();
const [countryCode, setCountryCode] = useState('US'); // default selection
  const [country, setCountry] = useState(null);
    function navigate() {
        navigation.navigate('Restrictions', {
          nationality: countryCode,
          dietary: preference
        });
    }

    const onSelect = (selectedCountry) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
  };
  return (
    <Screen style={styles.screen} >
    <View style={styles.container}>
        <View style={styles.header}>
            <Logo width={105} height={105} fill={colors.logo} />
            <Text style={styles.title}>Nationality</Text>
            
        </View>
      <Text style={styles.label}>Select your nationality</Text>
       <View style={styles.nationality_container}>
     
        <CountryPicker
          countryCode={countryCode}
          withFilter
          withFlag
          withCountryNameButton
          withAlphaFilter
          withCallingCode
          onSelect={onSelect}
        />
      
    </View>

      <Text style={styles.label}>Select your dietary restriction</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={preference}
          onValueChange={(itemValue) => setPreference(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select preference" value="" />
          <Picker.Item label="Vegetarian" value="vegetarian" />
          <Picker.Item label="Halal" value="halal" />
          <Picker.Item label="idk" value="idk" />
        </Picker>
      </View>


      <View style={styles.buttonWrapper}>
                      <Button
                        title="Next"
                        color="createButton"
                        onPress={navigate}
                        
                      />
        </View>
    </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
    header: {
        alignItems:'center'
    },
    screen: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    temp: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'red'
    },
  container: {
    flex: 1,
    padding: 20,
    height: 'auto',
    justifyContent: 'flex-start',
    marginTop: 60
  },
  title: {
      fontSize:   28,
      fontWeight: "700",
      color:      colors.onBackground,
      marginTop:  10,
    },
  label: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonWrapper: {
    marginTop: 15,
  },
  nationality_container: {
    borderColor: '#aaa',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1
  }
});

export default Nationality;
