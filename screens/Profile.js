import React from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";

const Profile = ({ children }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    marginTop: 48,
    paddingVertical: 10,
    color: "#333333",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
