import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext } from "react";

export const AuthContext = createContext();

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    await console.log(e);
  }
};

export const retrieveData = async (key) => {
  try {
    const asyncValue = await AsyncStorage.getItem(key);
    // console.log(asyncValue);
    return asyncValue != null ? asyncValue : null;
  } catch (e) {
    await console.log(e);
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

export const multiSet = async (arr) => {
  try {
    console.log(arr);
    await AsyncStorage.multiSet([...arr]);
  } catch (e) {
    console.log(e);
  }
};

export const clrerAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log(e);
  }
};
