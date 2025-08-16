import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const navigation = useNavigation();

    function goToEditRestriction() {
        navigation.navigate("Edit Restrictions"); 
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Toggle row */}
      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      {/* Button row */}
      <TouchableOpacity style={styles.row} onPress={goToEditRestriction}>
        <Text style={styles.label}>Change Restrictions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row}>
        <Text style={[styles.label, { color: "red" }]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
  },
});
