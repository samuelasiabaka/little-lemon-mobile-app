import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Onboarding from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { retrieveData, removeItem } from "./helpers/asyncStorage";
import { useEffect, useState, useReducer, createContext, useMemo } from "react";
import SplashScren from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import { AuthContext } from "./helpers/asyncStorage";
import { HeaderImage, HeaderNoImage } from "./components/Header";
import { createItemsTable } from "./helpers/db";

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "ON_BOARD":
          return {
            ...prevState,
            isLoading: false,
            isOnboardingCompleated: true,
          };
        case "SET_LOADING_FALSE":
          return {
            ...prevState,
            isLoading: false,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isLoading: false,
            isOnboardingCompleated: false,
          };
        case "SET_IMAGE":
          console.log("Setting image");
          console.log(action.data);
          return {
            ...prevState,
            image: action.data,
          };
      }
    },
    {
      isLoading: true,
      isOnboardingCompleated: false,
      image: null,
    }
  );

  const authContext = useMemo(
    () => ({
      onBoard: async (data) => {
        dispatch({ type: "ON_BOARD" });
      },
      setLoadingFalse: async () => {
        dispatch({ type: "SET_LOADING_FALSE" });
      },
      signOut: async () => {
        dispatch({ type: "SIGN_OUT" });
      },
      setImage: async (data) => {
        dispatch({ type: "SET_IMAGE", data: data });
      },
    }),
    []
  );

  useEffect(() => {
    (async () => {
      const userEmail = await retrieveData("email");
      const aiimage = await retrieveData("image");

      if (userEmail) {
        dispatch({ type: "ON_BOARD" });
      }

      if (aiimage) {
        dispatch({ type: "SET_IMAGE", data: aiimage });
      }

      dispatch({ type: "SET_LOADING_FALSE" });
    })();
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     await removeItem("email");
  //   })();
  // });

  if (state?.isLoading) {
    return <SplashScren />;
  }
  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <Stack.Navigator>
          {state?.isOnboardingCompleated ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  header: (props) => <HeaderNoImage {...props} />,
                }}
              />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          ) : (
            <Stack.Screen name="Onboarding" component={Onboarding} />
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
