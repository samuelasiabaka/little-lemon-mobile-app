import {
  Text,
  FlatList,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import Main from "../components/Main";
import { Button, TextInput } from "react-native-paper";
import {
  getAllItems,
  createItemsTable,
  addItem,
  clearItemsTable,
  db,
} from "../helpers/db";
import { debounce } from "lodash";

const ItemDivider = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "lightgray",
      }}
    />
  );
};

function MenuItem({ name, price, category, description, image }) {
  return (
    <View style={styles.menuItemContainer}>
      <View style={styles.menuItemMain}>
        <Text style={styles.menuItemName}>{name}</Text>
        <Text style={styles.menuItemDescription}>{description}</Text>
        <Text style={styles.menuItemPrice}>$ {price}</Text>
      </View>
      <View>
        <Image
          style={styles.menuImage}
          source={{
            uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
          }}
        />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [apiData, setApiData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPhrase, setCurrentPhrase] = useState("");

  function insertItemsToDb(items) {
    for (item of items) {
      addItem(item);
    }
  }

  function filterOnSearch(phrase) {
    console.log(phrase);
    setCurrentPhrase(phrase);

    if (selectedCategories && selectedCategories.length >= 1) {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM items WHERE name LIKE '%${phrase}%' AND category IN (?, ?, ?, ?)`,
          [...selectedCategories],
          (txObj, resultSet) => {
            console.log(resultSet);
            setApiData(resultSet.rows._array);
          },
          (txObj, error) => console.log(error)
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM items WHERE name LIKE '%${phrase}%'`,
          [],
          (txObj, resultSet) => {
            console.log(resultSet);
            setApiData(resultSet.rows._array);
          },
          (txObj, error) => console.log(error)
        );
      });
    }
  }

  const filterDebounced = useCallback(debounce(filterOnSearch, 500), []);

  function filterOnPress(value) {
    const categies = selectedCategories;
    if (categies.includes(value)) {
      // remove the value
      let index = categies.indexOf(value);
      if (index > -1) {
        categies.splice(index, 1);
      }
      setSelectedCategories(categies);
    } else {
      categies.push(value);
      setSelectedCategories(categies);
    }

    if (categies.length >= 1) {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM items WHERE name LIKE '%${currentPhrase}%' AND category IN (?, ?, ?, ?)`,
          [...categies],
          (txObj, resultSet) => {
            setApiData(resultSet.rows._array);
          },
          (txObj, error) => console.log(error)
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM items WHERE name LIKE '%${currentPhrase}%'`,
          [],
          (txObj, resultSet) => {
            console.log(resultSet);
            setApiData(resultSet.rows._array);
          },
          (txObj, error) => console.log(error)
        );
      });
    }
  }

  useEffect(() => {
    createItemsTable();
    // clearItemsTable();
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM items",
        [],
        (txObj, resultSet) => {
          if (!resultSet.rows._array || resultSet.rows._array.length <= 0) {
            fetch(
              "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
            )
              .then((data) => data.json())
              .then((d) => {
                insertItemsToDb(d.menu);
                setApiData(d.menu);
              });
          } else {
            setApiData(resultSet.rows._array);
          }
        },
        (txObj, error) => {
          console.log(error);
        }
      );
    });

    if (!apiData || apiData.length <= 0) {
    }
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Main />
        <View style={styles.searchBar}>
          <TextInput
            style={styles.formTextInput}
            mode="outlined"
            textColor="#777"
            left={<TextInput.Icon icon="card-search-outline" />}
            onChangeText={(text) => filterDebounced(text)}
          />
        </View>
        <View style={styles.orderView}>
          <Text style={styles.orderText}>Order For Delivery!</Text>
          <View style={styles.orderViewButtons}>
            <Button
              style={styles.changeButton}
              mode="outlined"
              compact={true}
              textColor={
                selectedCategories.includes("starters") ? "white" : "#777"
              }
              buttonColor={
                selectedCategories.includes("starters") ? "#333333" : null
              }
              onPress={() => filterOnPress("starters")}
            >
              Starters
            </Button>
            <Button
              style={styles.changeButton}
              mode="outlined"
              compact={true}
              textColor={
                selectedCategories.includes("mains") ? "white" : "#777"
              }
              buttonColor={
                selectedCategories.includes("mains") ? "#333333" : null
              }
              onPress={() => filterOnPress("mains")}
            >
              Mains
            </Button>
            <Button
              style={styles.changeButton}
              mode="outlined"
              compact={true}
              textColor={
                selectedCategories.includes("desserts") ? "white" : "#777"
              }
              buttonColor={
                selectedCategories.includes("desserts") ? "#333333" : null
              }
              onPress={() => filterOnPress("desserts")}
            >
              Desserts
            </Button>
            <Button
              style={styles.changeButton}
              mode="outlined"
              compact={true}
              textColor={
                selectedCategories.includes("drinks") ? "white" : "#777"
              }
              buttonColor={
                selectedCategories.includes("drinks") ? "#333333" : null
              }
              onPress={() => filterOnPress("drinks")}
            >
              Drinks
            </Button>
          </View>
        </View>
        <ItemDivider />
        <FlatList
          ItemSeparatorComponent={ItemDivider}
          data={apiData}
          renderItem={({ item }) => (
            <MenuItem
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
              category={item.category}
            />
          )}
          keyExtractor={(item) => item.name}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuItemContainer: {
    flexDirection: "row",
  },
  menuItemMain: {
    width: "70%",
    padding: 10,
  },
  menuItemName: {
    fontSize: 20,
  },
  menuItemDescription: {
    color: "#777",
    marginTop: 5,
    minHeight: 60,
  },
  menuItemPrice: {
    fontSize: 18,
    marginTop: 10,
  },
  menuImage: {
    width: 100,
    height: 110,
    marginTop: 10,
    borderRadius: 20,
  },
  orderView: {},
  orderViewButtons: {
    flexDirection: "row",
  },
  changeButton: {
    width: 80,
    marginBottom: 20,
    margin: 5,
  },
  orderText: {
    fontSize: 20,
    padding: 10,
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: "#495E57",
  },
  formTextInput: {
    margin: 10,
  },
});
