import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
} from "react-native";
import { supabase } from "../lib/supabase";


export default function UserInfo() {
  const [veg, setVegValue] = useState(null);
  const [colorblind, setColorBlind] = useState(null);
    const [skillIssue, setSkillIssue] = useState(null);
    const [nationality, setNationality] = useState("");
  useEffect(() => {
    const getUserData = async () => {
      const data = await fetchUserDetails();
      if (data && data.length > 0) {
        setVegValue(data[0].veg);
        setColorBlind(data[0].colorblind);
        setSkillIssue(data[0].skill_issue);
        setNationality(data[0].nationality);
      }
    };
    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.line}>
            <Text>{`Nationality: ${nationality}`}</Text>
        </View>
        <View style={styles.line}>
          
          <Text>{colorblind !== null ? `Veg: ${veg ? 'Yes' : 'No'}` : "" }</Text>
        </View>
        <View style={styles.line}>
          <Text>{colorblind !== null ? `Colorblind: ${colorblind ? 'Yes' : 'No'}` : "" }</Text>

        </View>
        <View style={styles.line}>
          <Text>{skillIssue !== null ? `Skill Issue: ${skillIssue ? 'Yes' : 'No'}` : "" }</Text>

        </View>
      </View>
    </View>
  );
}

async function fetchUserDetails() {
  const { data: { user } } = await supabase.auth.getUser();

  try {
    const { data, error } = await supabase
      .from("UserDetails")
      .select("*")
      .eq("id", user.id);

    if (error) {
      console.error("Supabase fetch error:", error);
      return null;
    }

    console.log("Fetched data:", data);
    return data;
  } catch (e) {
    console.error("Unexpected error:", e);
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  card: {
    backgroundColor: "gray",
    padding: 30,
    borderRadius: 10,
  },
  line: {
    flexDirection: "row",
  },
});
