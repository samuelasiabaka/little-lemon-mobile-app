import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Pressable, SectionList, Alert, ScrollView, FlatList } from 'react-native';
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories, } from "../database";
import { Searchbar } from "react-native-paper";
import { getSectionListData, useUpdateEffect, validateEmail, validateName } from "../util";
import debounce from "lodash.debounce";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const apiURL =
  "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";
const categories = ["starters", "mains", "desserts"];

const MenuItem = ({ name, price, description, imageFileName }) => (
    <View style={styles.item}>
      <View style={styles.itemBody}>
        <Text style={styles.name}>{name}</Text>
        <Text numberOfLines={2} ellipsizeMode='tail' style={styles.description}>{description}</Text>
        <Text style={styles.price}>${price}</Text>
      </View>
      <Image
        style={styles.itemImage}
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`,
        }}
      />
    </View>
  );

const Home = ({ navigation }) => {
  const [data, setData] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    menuItems: [],
  });

  const [categories, setCategories] = useState({
    Starters: false,
    Mains: false,
    Desserts: false,
    Drinks: false,
  });
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(apiURL);
      const json = await response.json();
      const menu = json.menu.map((item, index) => ({
        id: index+1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category,
      }));
      return menu;
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  useUpdateEffect(() => {
    (async () => {
      try {
        const selectedCategorieNames = Object.keys(categories).reduce(
          (selectedCategories, category) => {
            if (categories[category]) { selectedCategories.push(category); }
            return selectedCategories;
          }, []
        );
        const menuItems = await filterByQueryAndCategories(
          query,
          selectedCategorieNames
        );
        setData((prev) => ({
          ...prev,
          menuItems: menuItems,
        }));
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [categories, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchText(text);
    debouncedLookup(text);
  };

  getFirstLetterUp = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase();
    } else {
      return "";
    }
  };

  readSavedData = async () => {
    const avatar = (await AsyncStorage.getItem("AVATAR")) ?? "";
    const firstName = (await AsyncStorage.getItem("FIRSTNAME")) ?? "";
    const lastName = (await AsyncStorage.getItem("LASTNAME")) ?? "";

    setData((prev) => ({
      ...prev,
      avatar: avatar,
      firstName: firstName,
      lastName: lastName,
    }));
  };

  const readMenuItems = async () => {
    try {
      await createTable();
      let menuItems = await getMenuItems();

      if (!menuItems.length) {
        menuItems = await fetchData();
        saveMenuItems(menuItems);
      }

      setCategories(() => {
        return [...new Set(menuItems.map((item) => item.category))].reduce(
          (a, v) => ({ ...a, [v]: true }),
          {}
        );
      });

      setData((prev) => ({
        ...prev,
        menuItems: menuItems,
      }));
    } catch (e) {
      // Handle error
      Alert.alert(e.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      readSavedData();
      readMenuItems();
    });
    return unsubscribe;
  }, [navigation]);
  
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
  
  return(
    <ScrollView style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require("../assets/littleLemonLogo.png")}
          accessible={true}
          accessibilityLabel={"Little Lemon Logo"}
        />
        <Pressable
          style={styles.avatar}
          onPress={() => navigation.navigate("Profile")}
        >
          {data.avatar ? (
            <Image source={{ uri: data.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarEmpty}>
              <Text style={styles.avatarEmptyText}>
                {data.firstName && Array.from(data.firstName)[0]}
                {data.lastName && Array.from(data.lastName)[0]}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <View style={styles.heroSection}>
        <Text style={styles.heroHeader}>Little Lemon</Text>
        <View style={styles.heroBody}>
          <View style={styles.heroContent}>
            <Text style={styles.heroSubHeader}>Chicago</Text>
            <Text style={styles.heroText}>
              We are a family owned Mediterranean restaurant, focused on
              traditional recipes served with a modern twist.
            </Text>
          </View>
          <Image
            style={styles.heroImage}
            source={require("../assets/food.png")}
            accessible={true}
            accessibilityLabel={"Little Lemon Food"}
          />
        </View>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
          value={searchText}
          style={styles.searchBar}
          iconColor="#333333"
          inputStyle={{ color: "#333333" }}
          elevation={0}
        />
      </View>
      <Text style={styles.title}>ORDER FOR DELIVERY!</Text>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.categoryButtonsSection}
      >
        {Object.keys(categories).map((category, index) => (
          <Pressable
            onPress={() => 
              setCategories((prev) => {
                const newState = { ...prev };
                newState[category] = !newState[category];
                return newState;
              })
            }
            style={[
              styles.categoryButton,
              {
                flex: 1 / Object.keys(categories).length,
                backgroundColor: categories[category] ? "#495e57" : "#e9ebea",
              },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.categoryButtonText,
                  { color: categories[category] ? "#e9ebea" : "#495e57",},
                ]}
              >
                {category}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      {/* <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MenuItem
            name={item.name}
            price={item.price}
            description={item.description}
            imageFileName={item.image}
          />
        )}
        renderSectionHeader={({ section: { name } }) => (
          <Text style={styles.itemHeader}>{name}</Text>
        )}
      /> */}
      <FlatList
        style={styles.dishes}
        data={data.menuItems}
        keyExtractor={(dish) => dish.name}
        renderItem={({ item }) => (
          <View style={styles.dishInfoPicture}>
            <View style={styles.dishInfo}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishDescription}>
                {item.description.length > 50
                  ? item.description.substr(0, 50) + "\u2026"
                  : item.description}
              </Text>
              <Text style={styles.dishPrice}>{item.price}</Text>
            </View>
            <View style={styles.dishPictureWrapper}>
              <Image
                style={styles.dishPicture}
                source={{
                  uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
                }}
              />
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}; 
    
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  stretch: {
    resizeMode: 'contain',
    height: 70,
    width: 400,
    backgroundColor: '#aaa',
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
  header: {
    fontFamily: "Karla-Regular",
    fontSize: 38,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  title: {
    fontFamily: "Karla-Regular",
    fontSize: 30,
    paddingTop: 10,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: "#495e57",
    backgroundColor: "#fff",
    fontFamily: "Karla-Regular",
  },
  name: {
    fontSize: 24,
    color: "#000000",
    paddingBottom: 5,
    fontFamily: "Karla-Regular",
  },
  description: {
    color: "#495e57",
    fontSize: 20,
    paddingRight: 5,
    
    fontFamily: "Karla-Regular",
  },
  price: {
    fontSize: 20,
    color: "#495e57",
    paddingTop: 5,
    fontFamily: "Karla-Regular",
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  logo: {
    height: 50,
    width: 150,
    resizeMode: "contain",
  },
  avatar: {
    flex: 1,
    position: "absolute",
    right: 18,
    top: 40,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarEmpty: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0b9a6a",
    alignItems: "center",
    justifyContent: "center",
  },
  heroSection: {
    backgroundColor: "#495e57",
    padding: 15,
  },
  heroHeader: {
    color: "#f4ce14",
    fontSize: 80,
    fontFamily: "MarkaziText-Regular",
    marginTop: -10,
  },
  heroSubHeader: {
    color: "#fff",
    fontSize: 50,
    fontFamily: "MarkaziText-Regular",
    marginTop: -20,
  },
  heroText: {
    color: "#fff",
    fontFamily: "Karla-Regular",
    fontSize: 20,
    marginTop: 20,
  },
  heroBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroContent: {
    flex: 1,
  },
  heroImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginTop: 15,
    backgroundColor: "#e4e4e4",
  },
  category: {
    marginTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  categoryTitle: {
    textTransform: "uppercase",
    fontSize: 22,
    fontWeight: "bold",
  },
  categoryButtonsSection: {
    flexDirection: "row",
    marginTop: 12,
    marginBottom: 25,
  },
  categoryButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 7,
    paddingLeft: 18,
    paddingRight: 18,
    marginLeft: 6,
    marginRight: 6,
    borderRadius: 10,
  },
  categoryButtonText: {
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  dishes: {
    borderTopColor: "#cccccc",
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  dishInfoPicture: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomColor: "#eaeceb",
    borderBottomWidth: 1,
  },
  dishInfo: {
    width: "60%",
  },
  dishName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  dishDescription: {
    color: "#495e57",
    marginBottom: 6,
  },
  dishPrice: {
    color: "#495e57",
    fontWeight: "700",
  },
  dishPictureWrapper: {
    width: "30%",
    justifyContent: "center",
    alignContent: "center",
  },
  dishPicture: {
    width: 100,
    height: 100,
  },
});