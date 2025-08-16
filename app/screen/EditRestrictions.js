import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import Screen from "../components/Screen";


import Logo from "../assets/logo.svg";
import colors             from "../config/colors";
import Button             from "../components/Button";

import { useRoute } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function EditRestrictions() {
    const [restriction, setRestriction] = useState('');
        const [preference, setPreference] = useState('');
        const navigation = useNavigation();

        const [isSkillIssuesChecked, setSkillIssuesChecked] = useState(false);
        const [isColorBlindChecked, setColorBlindChecked] = useState(false);
        const [isVeganChecked, setVeganChecked] = useState(false);
        const [isHlalChecked, setHalalChecked] = useState(false);

        function temp() {

        }

          useEffect(() => {
            const getUserData = async () => {
              const data = await fetchRestrictions();
              if (data && data.length > 0) {
                setVeganChecked(data[0].veg);
                setColorBlindChecked(data[0].colorblind);
                setSkillIssuesChecked(data[0].skill_issue);
                setHalalChecked(data[0].halal);
              }
            };
            getUserData();
          }, []);

    function setAllRestrictions() {
        updateRestrictions(isVeganChecked, isSkillIssuesChecked, isColorBlindChecked, isHlalChecked);
        navigation.pop();
    }

    function back() {
        navigation.pop();
    }

    return(
        <Screen style={styles.screen} >
    <View style={styles.container}>
        <View style={styles.header}>
            <Logo width={105} height={105} fill={colors.logo} />
            <Text style={styles.title}>Restrictions</Text>
            
        </View>
      <Text style={styles.label}>Update your restrictions</Text>
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

                <View style={styles.checkboxRow}>
                    <Switch
                    value={isVeganChecked}
                    onValueChange={setVeganChecked}
                    />
                    <Text style={styles.label}>Vegan</Text>
                </View>

                <View style={styles.checkboxRow}>
                    <Switch
                    value={isHlalChecked}
                    onValueChange={setHalalChecked}
                    />
                    <Text style={styles.label}>Halal</Text>
                </View>
            </View>
    </View>


    
      <View style={styles.buttonWrapper}>
                      <Button style={styles.btn}
                        title="Confirm"
                        color="createButton"
                        onPress={setAllRestrictions}
                        
                      />

                      <Button style={styles.btn}
                        title="Reset"
                        color="createButton"
                        onPress={back}
                        
                      />
        </View>


    
    </Screen>
    );
}

async function updateRestrictions(veg, skill_issue, colorblind, halal) {

    const { data: { user } } = await supabase.auth.getUser();

    try {


    const { data, error } = await supabase
      .from('UserDetails') 
      .update({veg: veg, skill_issue: skill_issue, colorblind: colorblind, halal: halal })
      .eq("id", user.id);




    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('Inserted successfully:', data);
    }
  } catch (e) {
    console.error('Unexpected error:', e);
  }
}


async function fetchRestrictions() {

    const { data: { user } } = await supabase.auth.getUser();

  try {


    const { data, error } = await supabase
      .from('UserDetails') 
      .select('*')
      .eq("id", user.id); 




    if (error) {
      console.error('Supabase fetch error:', error);
      return null;
    }

    console.log('Fetched data:', data);
    return data;

  } catch (e) {
    console.error('Unexpected error:', e);
    return null;
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
    // height: 'auto',
    justifyContent: 'flex-start',
    // marginTop: 40,
    // height: '60vh',
    maxHeight: '60%'
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
    // marginTop: 15,
    // textAlign: 'center',
    // justifyContent: 'center',
    // alignItems: 'center'
    gap: 10
  },
  btn: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
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


