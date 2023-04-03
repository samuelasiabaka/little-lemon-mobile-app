import { Text, View, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";

export default function Main() {
  return (
    <View style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>Little Lemon</Text>
      </View>

      <View style={styles.verticalContainer}>
        <View style={styles.subheader}>
          <Text style={styles.subheaderText}>Chicago</Text>
          <Text style={styles.subheaderDescription}>
            We Are a family owned Mediterranean restaurant focused on
            traditional recipes served with a modern twist
          </Text>
        </View>

        <View>
          <Image
            style={styles.image}
            source={require("../assets/Images/Hero_image.png")}
          />
        </View>
      </View>
      {/* <Button
        style={styles.searchButton}
        buttonColor="#EDEFEE"
        textColor="#777"
        icon="search-web"
      ></Button> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#495E57",
    padding: 10,
  },
  titleText: {
    fontSize: 30,
    color: "#F4CE14",
  },
  verticalContainer: {
    flexDirection: "row",
    marginTop: 10,
  },

  subheader: {
    width: "60%",
  },

  subheaderText: {
    color: "#EDEFEE",
    fontSize: 20,
  },
  subheaderDescription: {
    marginTop: 10,
    color: "#EDEFEE",
  },
  image: {
    width: 100,
    height: 110,
    marginLeft: 20,
    borderRadius: 20,
  },
  searchButton: {
    width: 0,
    padding: 4,
    margin: 5,
  },
});
