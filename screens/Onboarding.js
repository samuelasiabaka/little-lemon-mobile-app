import { View, Text, Image, StyleSheet, TextInput, Button } from "react-native";
import { useState, useContext } from "react";
import { storeData } from "../helpers/asyncStorage";
import { AuthContext } from "../helpers/asyncStorage";

export default function Onboarding({ navigation: { navigate } }) {
  const { onBoard } = useContext(AuthContext);

  const [firstName, onChangeFirstName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  function validateEmail(email) {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regex.test(email) === false) {
      // Email is Not Correct
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
    onChangeEmail(email);
  }

  function onButtonPress() {
    storeData("email", email);
    storeData("firstName", firstName);
    onBoard();
  }

  return (
    <>
      <View style={styles.main}>
        <View style={styles.header}>
          <Image source={require("../assets/Images/Logo.png")} />
        </View>
        <View style={styles.form}>
          <View style={styles.formText}>
            <Text style={styles.welcomeText}>Let us get to know you</Text>
          </View>

          <View style={styles.formInputs}>
            <Text style={styles.inputText}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              keyboardType="default"
              onChangeText={onChangeFirstName}
            />
            <Text style={styles.inputText}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={(text) => validateEmail(text)}
              autoCapitalize="none"
            />
          </View>
        </View>
        <View style={styles.button}>
          <Button
            style={styles.buttonElement}
            disabled={!firstName || !email || emailValid == false}
            title="Next"
            onPress={onButtonPress}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  header: {
    flex: 0.2,
    marginLeft: "auto",
    marginRight: "auto",
  },
  formText: {
    flex: 0.3,
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: "10em",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    flex: 0.5,
  },
  formInputs: {
    flex: 0.6,
  },
  inputText: {
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 20,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  button: {
    alignItems: "flex-end",
  },
  buttonElement: {
    padding: 2,
  },
});
