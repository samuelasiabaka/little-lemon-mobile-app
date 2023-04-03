import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { Alert } from 'react-native';
import Onboarding from './screens/Onboarding';
import Profile from './screens/Profile';
import Home from './screens/Home.js'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './context/AuthContextCreate';
import useUpdate from './useUpdate';
import SplashScreen from './screens/SplashScreen';
import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();
const temp = true;

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "loggedIn":
          return {
            isOnboardingCompleted: true,
            isLoading: false,
          };
        case "loggedOut":
          return {
            isOnboardingCompleted: false,
            isLoading: false,
          };
      }
    },
    {
      isLoading: true,
      isOnboardingCompleted: false,
    }
  );
  
  const authContextProvider = useMemo(
    () => ({
      logIn: () => {
        dispatch({ type: "loggedIn" });
      },
      logOut: () => {
        dispatch({ type: "loggedOut" });
      },
    }),
    []
  );

  ToBoolean = (string) => {
    if (string === null) {
      return false;
    } else {
      return string === "true";
    }
  };

  const readLoginState = async () => {
    if (ToBoolean(await AsyncStorage.getItem("IS_LOGGED_IN"))) {
      dispatch({ type: "loggedIn" });
    } else {
      dispatch({ type: "loggedOut" });
    }
  };

  useEffect(() => {
    readLoginState();
  }, []);

  // // This effect only runs when the preferences state updates, excluding initial mount
  // useUpdate(() => {
  //   (async () => {
  //     // Every time there is an update on the preference state, we persist it on storage
  //     // The exercise requierement is to use multiSet API
  //     const keyValues = Object.entries(userPref).map((entry) => {
  //       return [entry[0], String(entry[1])];
  //     });
  //     try {
  //       await AsyncStorage.multiSet(keyValues);
  //     } catch (e) {
  //       Alert.alert(`An error occurred: ${e.message}`);
  //     }
  //   })();
  // }, [userPref]);

  if (state.isLoading) {
    // We haven't finished reading from AsyncStorage yet
    return <SplashScreen />;
  }
  return (
    <AuthContext.Provider value={authContextProvider}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading">
          { state.isOnboardingCompleted ? (
            <>
              <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            // User is NOT signed in
            <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}