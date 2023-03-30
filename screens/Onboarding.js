import React from "react";
import {
  Pressable,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";

const Onboarding = () => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/Logo.png")} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Let us get to know you</Text>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          textContentType="name"
          placeholder={"Enter your name"}
          clearButtonMode="always"
          textAlign={"center"}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder={"Enter your email"}
          clearButtonMode="always"
          textAlign={"center"}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.buttonWrapper} disabled={!name && !email}>
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    // backgroundColor: "grey",
  },
  logoContainer: {
    // flex: 1,
    backgroundColor: "#EDEFEE",
    alignItems: "center",
  },
  logo: {
    height: 200,
    width: 300,
    resizeMode: "contain",
  },

  formContainer: {
    // flex: 1,
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C6D1CC",
  },
  title: {
    marginBottom: 100,
    paddingVertical: 10,
    color: "#333333",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    color: "#333333",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    marginVertical: 15,
    borderRadius: 8,
    borderWidth: 2,
    width: "70%",
    padding: 10,
    fontSize: 18,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: "flex-end",
    paddingRight: 60,
  },
  buttonWrapper: {
    width: "30%",
    borderRadius: 5,
    backgroundColor: "#495E57",
    alignItems: "center",
    paddingVertical: 10,
  },
  disabled: {
    backgroundColor: "grey",
    opacity: 0.5,
  },
});
