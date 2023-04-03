import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContextCreate';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateEmail, validateName, validateNumber } from "../util"
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";
//import "../index.css";


const greeting = "Let us get to know you";

const Profile = () => {
  const { logOut } = useContext(AuthContext);

  const [input, setInput] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    readAsyncStorage();
  }, []);

  const selectPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setInput((prev) => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };

  const removePicture = () => {
    setInput((prev) => ({ ...prev, avatar: "" }));
  };
  
  const clearCurrentUser = async () => {
    await AsyncStorage.clear();
    logOut();
  };

  const readAsyncStorage = async () => {
    const avatar = (await AsyncStorage.getItem("AVATAR")) ?? "";
    const firstName = (await AsyncStorage.getItem("FIRSTNAME")) ?? "";
    const lastName = (await AsyncStorage.getItem("LASTNAME")) ?? "";
    const email = (await AsyncStorage.getItem("EMAIL")) ?? "";
    const phoneNumber = (await AsyncStorage.getItem("PHONE_NUMBER")) ?? "";
    setInput({
      avatar: avatar,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
    });
  };

  saveInputToAsyncStorage = async () => {
    if (!validateNumber(input.phoneNumber)) {
      Alert.alert(
        "Correct Data:",
        "The phone number should be 10 characters long."
      );
      return;
    } else if (!validateEmail(input.email)) {
      Alert.alert("Correct Data:", "The E-Mail is not well formed.");
    }
    await AsyncStorage.setItem("AVATAR", input.avatar);
    await AsyncStorage.setItem("FIRSTNAME", input.firstName);
    await AsyncStorage.setItem("LASTNAME", input.lastName);
    await AsyncStorage.setItem("EMAIL", input.email);
    await AsyncStorage.setItem("PHONE_NUMBER", input.phoneNumber);
    Alert.alert("Success", "Successfully saved changes!");
  };

  const properCase = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase();
    } else {
      return "";
    }
  };

  const onFirstnameChanged = (firstName) => {
    if (firstName === "" || validateName(firstName)) {
      setInput((prev) => ({ ...prev, firstName: firstName }));
    }
  };

  const onLastnameChanged = (lastName) => {
    if (lastName === "" || validateName(lastName)) {
      setInput((prev) => ({ ...prev, lastName: lastName }));
    }
  };

  const onEmailChanged = (email) => setInput((prev) => ({ ...prev, email: email }));

  const onPhoneNumberChanged = (phoneNumber) => setInput((prev) => ({ ...prev, phoneNumber: phoneNumber }));


  const getIsFormValid = () => {
    return (
      validateName(input.firstName) &&
      validateName(input.lastName) &&
      validateEmail(input.email) &&
      validateNumber(input.phoneNumber)
    );
  };

  //Font Stuff
  const [fontsLoaded] = useFonts({
    "Karla-Regular": require("../assets/fonts/Karla-Regular.ttf"),
    "MarkaziText-Regular": require("../assets/fonts/MarkaziText-Regular.ttf"),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  };

  

  return(
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      onLayout={onLayoutRootView}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          {/* <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require("../assets/littleLemonLogo.png")}
              accessible={true}
              accessibilityLabel={"Little Lemon Logo"}
            />
          </View> */}
          <View style={styles.content}>
            <Text style={styles.title}>Personal Information</Text>
            <View style={styles.sectionMargin}>
              <Text style={styles.inputTitle}>Avatar</Text>
              <View style={styles.avatarContainer}>
                {input.avatar ? (
                  <Image source={{ uri: input.avatar }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarEmpty}>
                    <Text style={styles.avatarEmptyText}>
                      {input.firstName && Array.from(input.firstName)[0]}
                      {input.lastName && Array.from(input.lastName)[0]}
                    </Text>
                  </View>
                )}
                <View style={styles.avatarButtons}>
                  <Pressable
                    style={styles.changeBtn}
                    title="Pick an image from camera roll"
                    onPress={selectPicture}
                  >
                    <Text style={styles.saveBtnText}>Change</Text>
                  </Pressable>
                  <Pressable
                    style={styles.removeBtn}
                    title="Pick an image from camera roll"
                    onPress={removePicture}
                  >
                    <Text style={styles.discardBtnText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
              <Text
                style={[
                  styles.text,
                  validateName(input.firstName) ? "" : styles.error,
                ]}
              >
                First Name
              </Text>
              <TextInput
                style={styles.inputBox}
                value={input.firstName}
                onChangeText={onFirstnameChanged}
                placeholder={"First Name"}
              />
              <Text
                style={[
                  styles.text,
                  validateName(input.lastName) ? "" : styles.error,
                ]}
              >
                Last Name
              </Text>
              <TextInput
                style={styles.inputBox}
                value={input.lastName}
                onChangeText={onLastnameChanged}
                placeholder={"Last Name"}
              />
              <Text
                style={[
                  styles.text,
                  validateEmail(input.email) ? "" : styles.error,
                ]}
              >
                Email
              </Text>
              <TextInput
                style={styles.inputBox}
                value={input.email}
                keyboardType="email-address"
                onChangeText={onEmailChanged}
                placeholder={"Email"}
              />
              <Text
                style={[
                  styles.text,
                  validateNumber(input.phoneNumber) ? "" : styles.error,
                ]}
              >
                Phone number (10 digit)
              </Text>
              <TextInput
                style={styles.inputBox}
                value={input.phoneNumber}
                keyboardType="phone-pad"
                onChangeText={onPhoneNumberChanged}
                placeholder={"Phone number"}
              />
            </View>
            <Pressable 
              style={styles.btn}
              onPress={clearCurrentUser}
            >
              <Text style={styles.btntext}>Log out</Text>
            </Pressable>
            <View style={styles.buttons}>
              <Pressable 
                style={styles.discardBtn} 
                onPress={readAsyncStorage}
                >
                <Text style={styles.discardBtnText}>Discard changes</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, getIsFormValid() ? "" : styles.btnDisabled]}
                onPress={saveInputToAsyncStorage}
                disabled={!getIsFormValid()}
              >
                <Text style={styles.saveBtnText}>Save changes</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}; 
    
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    fontFamily: "Karla-Regular",
    fontSize: 38,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarEmpty: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#0b9a6a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmptyText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  avatarButtons: {
    flexDirection: "row",
  },
  stretch: {
    resizeMode: 'contain',
    height: 70,
    width: 400,
    backgroundColor: '#aaa',
  },
  btn: {
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginVertical: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cc9a22",
  },
  btntext: {
    fontSize: 22,
    color: "#3e524b",
    fontFamily: "Karla-Regular",
    alignSelf: "center",
  },
  btnDisabled: {
    backgroundColor: "#98b3aa",
  },
  button: {
    fontSize: 18,
    padding: 6,
    marginVertical: 26,
    margin: 30,
    marginLeft: 260,
    backgroundColor: '#aaa',
    borderRadius: 8
  },
  buttonText: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 24,
  },
  top: {
    paddingTop: 50,
    height: 140,
    width: 400,
    backgroundColor: '#aaa',
  },
  footer: {
    marginTop: 60,
    paddingTop: 30,
    height: 170,
    width: 400,
    backgroundColor: '#ccc',
  },
  input: {
    height: 50,
    width: 300,
    margin: 10,
    borderWidth: 2,
    borderRadius: 6,
    padding: 10,
    fontSize: 24,
  },
  inputBox: {
    alignSelf: "stretch",
    marginTop: 4,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 9,
    borderColor: "#dfdfe5",
  },
  title: {
    //fontFamily: "Regular",
    fontSize: 28,
    paddingBottom: 10,
  },
  inputTitle:{
    fontSize: 16,
    color: "#333",
  },
  error: {
    color: "#d14747",
    fontWeight: "bold",
  },
  sectionMargin: {
    marginBottom: 18,
  },
  content: {
    flex: 0.7,
    marginLeft: 20,
    marginRight: 20,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
  changeBtn: {
    backgroundColor: "#495e57",
    borderRadius: 9,
    marginHorizontal: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f554d",
  },
  removeBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#495e57",
    borderRadius: 9,
    alignSelf: "stretch",
    padding: 10,
    borderWidth: 1,
    borderColor: "#3f554d",
  },
  saveBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
    alignSelf: "center",
    fontFamily: "Karla-Regular",
  },
  discardBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#83918c",
  },
  discardBtnText: {
    fontSize: 18,
    color: "#3e524b",
    alignSelf: "center",
    fontFamily: "Karla-Regular",
  },
});