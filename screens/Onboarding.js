import React, { useState, useCallback, useRef, useContext } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Pressable, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import {validateEmail, validateName} from "../util"
import { useFonts } from "expo-font";
import PagerView from "react-native-pager-view";
import * as SplashScreen from "expo-splash-screen";
import { AuthContext } from '../context/AuthContextCreate';
import AsyncStorage from "@react-native-async-storage/async-storage";


const greeting = "Let us get to know you";

function Onboarding() {
  const { logIn } = useContext(AuthContext);
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const [email, onChangeEmail] = useState("");

  const pagerRef = useRef(PagerView);

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
  }

  const getAreNamesValid = () => {
    return ( 
      firstName && lastName &&
      validateName(firstName) && 
      validateName(lastName)
    ); 
  }; 

  const getIsEmailValid = () => {
    return ( 
      validateEmail(email)
    ); 
  };

  completeOnboarding = async () => {
    await AsyncStorage.setItem("IS_LOGGED_IN", "true");
    await AsyncStorage.setItem("FIRSTNAME", firstName);
    await AsyncStorage.setItem("LASTNAME", lastName);
    await AsyncStorage.setItem("EMAIL", email);
    logIn();
  };

  return(
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        onLayout={onLayoutRootView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.top}>
              <Image 
                style={styles.stretch}
                source={require('../assets/logo.png')}
                alt="logo" 
              />
            </View>
            <Text style={styles.header}> 
              {greeting} 
            </Text>
            <PagerView
              style={styles.pager}
              scrollEnabled={false}
              initialPage={0}
              ref={pagerRef}
            >
              <View style={styles.page} key="1">
                <View style={styles.pageContainer}>
                  <Text style={styles.title}> 
                    First Name
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    autoComplete="given-name"
                    onChangeText={onChangeFirstName}
                    placeholder="First Name"
                  />
                  <Text style={styles.title}> 
                    Last Name
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    autoComplete="family-name"
                    onChangeText={onChangeLastName}
                    placeholder="Last Name"
                  />
                </View>
                <View style={styles.pageIndicator}>
                  <View style={[styles.pageDot, styles.pageDotActive]}></View>
                  <View style={styles.pageDot}></View>
                </View>
                <View style={styles.buttons}>
                  <Pressable
                    style={[styles.btn, getAreNamesValid() ? "" : styles.btnDisabled]}
                    onPress={() => { pagerRef.current.setPage(1); }}
                    disabled={!getAreNamesValid()}
                  >
                    <Text style={styles.buttonText}>NEXT</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.page} key="2">
                <View style={styles.pageContainer}>
                  <Text style={styles.title}> 
                    Email
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    autoCapitalize="none"
                    autoComplete="email"
                    onChangeText={onChangeEmail}
                    placeholder="Email"
                  />
                </View>
                <View style={styles.pageIndicator}>
                  <View style={styles.pageDot}></View>
                  <View style={[styles.pageDot, styles.pageDotActive]}></View>
                </View>
                <View style={styles.buttons}>
                  <Pressable
                    style={styles.flexBtn}
                    onPress={() => pagerRef.current.setPage(0)}
                  >
                    <Text style={styles.buttonText}>Back</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.flexBtn, getIsEmailValid ? "" : styles.btnDisabled]}
                    onPress={completeOnboarding}
                    disabled={!getIsEmailValid}
                  >
                    <Text style={styles.buttonText}>Submit</Text>
                  </Pressable>
                </View>
              </View>
            </PagerView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}; 
    
export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#999',
  },
  pager: {
    flex: 1
  },
  page: {
    justifyContent: "center",
  },
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pageIndicator: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  pageDot: {
    backgroundColor: "#67788a",
    width: 22,
    height: 22,
    marginHorizontal: 10,
    borderRadius: 11,
  },
  pageDotActive: {
    backgroundColor: "#f4ce14",
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  stretch: {
    resizeMode: 'contain',
    height: 70,
    width: 400,
    backgroundColor: '#aaa',
  },
  btn: {
    display: "flex",
    backgroundColor: "#f4ce14",
    borderColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 4,
    paddingHorizontal: 40,
    borderWidth: 1,
  },
  btnDisabled: {
    backgroundColor: "#f1f4f7",
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
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 18,
    marginBottom: 60,
  },
  flexBtn: {
    flex: 1,
    borderColor: "#f4ce14",
    backgroundColor: "#f4ce14",
    borderRadius: 9,
    alignSelf: "stretch",
    marginRight: 18,
    padding: 10,
    borderWidth: 1,
  },
  buttonText: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 36,
  },
  top: {
    paddingTop: 50,
    height: 130,
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
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
    alignSelf: "stretch",
    height: 50,
    margin: 18,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    borderRadius: 9,
    fontFamily: "Karla-Regular",
  },
  // input: {
  //   height: 50,
  //   width: 300,
  //   margin: 10,
  //   borderWidth: 2,
  //   borderRadius: 6,
  //   padding: 10,
  //   fontSize: 24,
  // },
  header: {
    fontFamily: "Karla-Regular",
    fontSize: 36,
    paddingTop: 10,
    textAlign: "center"
  },
  title: {
    fontFamily: "Karla-Regular",
    fontSize: 28,
    //paddingTop: 10,
  }
});