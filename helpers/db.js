import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabase("little_lemon.db");

export function createItemsTable() {
  console.log("Creating Items Table");
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS items ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price TEXT, category TEXT, image TEXT  )",
      null,
      (txObj, resultSet) => null,
      (txObj, error) => console.log(error)
    );
  });
}

export async function getItemsByCategory() {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM items WHERE category IN (starters)",
      [],
      (txObj, resultSet) => {
        return resultSet.rows._array;
      },
      (txObj, error) => console.log(error)
    );
  });
}

export async function getAllItems() {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM items",
      [],
      (txObj, resultSet) => {
        // console.log(resultSet.rows._array);
        return resultSet.rows._array;
      },
      (txObj, error) => {
        console.log("Error Getting Items");
        console.log(error);
      }
    );
  });
}

export function addItem(item) {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO items (name, description, price, category, image) values (?, ?, ?, ?, ?)",
      [item.name, item.description, item.price, item.category, item.image],
      (txObj, resultSet) => {
        // console.log(resultSet);
        return resultSet.rows._array;
      },
      (txObj, error) => console.log(error)
    );
  });
}

export function clearItemsTable() {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM items",
      null,
      (txObj, resultSet) => console.log(resultSet),
      (txObj, error) => console.log(error)
    );
  });
}
