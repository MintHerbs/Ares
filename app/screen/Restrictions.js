import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import Screen from "../components/Screen";

import Logo from "../assets/logo.svg";
import colors             from "../config/colors";
import Button             from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

const Restrictions = () => {
    const [restriction, setRestriction] = useState('');
    const [preference, setPreference] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { nationality, dietary } = route.params || {};
    const [isSkillIssuesChecked, setSkillIssuesChecked] = useState(false); //pu sanz nom la apres ofc
    const [isColorBlindChecked, setColorBlindChecked] = useState(false);

    const goToHome = () => {
        var isVeg = false;
        var isHalal = false
        dietary == "vegetarian" ? isVeg = true : isVeg = false;
        dietary == "halal" ? isHalal = true : isHalal = false;
        setUserDetails(nationality, isVeg, isSkillIssuesChecked, isColorBlindChecked, isHalal);

        navigation.replace("UserInfo"); 
    }
  return (
    <Screen style={styles.screen} >
    <View style={styles.container}>
        <View style={styles.header}>
            <Logo width={105} height={105} fill={colors.logo} />
            <Text style={styles.title}>Restrictions</Text>
            
        </View>
      <Text style={styles.label}>Do you have any other restrictionss? Select all that apply:</Text>
          <View style={styles.container}>
      <View style={styles.checkboxRow}>
        <Switch
          value={isSkillIssuesChecked}
          onValueChange={setSkillIssuesChecked}
        />
        <Text style={styles.label}>Skill issues</Text>
      </View>

      <View style={styles.checkboxRow}>
        <Switch
          value={isColorBlindChecked}
          onValueChange={setColorBlindChecked}
        />
        <Text style={styles.label}>Color Blindness</Text>
      </View>
    </View>



      <View style={styles.buttonWrapper}>
                      <Button
                        title="Create Account"
                        color="createButton"
                        onPress={goToHome}
                        
                      />
        </View>
    </View>
    </Screen>
  );
};
async function setUserDetails(nationality, veg, skill_issue, colorblind, halal) {
    
    const { data: { user } } = await supabase.auth.getUser();
    const id = user.id;
    try {


    const { data, error } = await supabase
      .from('UserDetails') 
      .insert([{ id, nationality, veg, skill_issue, colorblind, halal }]);
    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('Inserted successfully:', data);
    }
  } catch (e) {
    console.error('Unexpected error:', e);
  }

}


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
  checkboxRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 10 
},
  label: { 
    marginLeft: 10, 
    fontSize: 18 
},
});

export default Restrictions;
