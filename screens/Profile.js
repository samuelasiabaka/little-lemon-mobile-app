import { Text, View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Avatar, Button, TextInput, Checkbox } from "react-native-paper";
import {
  retrieveData,
  storeData,
  multiSet,
  clrerAll,
} from "../helpers/asyncStorage";
import { useEffect, useState, useContext } from "react";
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../helpers/asyncStorage";

export default function ProfileScreen() {
  const { signOut } = useContext(AuthContext);

  const [firstName, onFirstNameChange] = useState("");
  const [lastName, onLastNameChange] = useState("");
  const [email, onEmailChange] = useState("");
  const [phoneNumber, onPhoneNumberChange] = useState();
  const [orderStatuses, onOrderStatusesChange] = useState(true);
  const [passwordChanges, onPasswordChangesChange] = useState(true);
  const [specialOffers, onSpecialOffersChange] = useState(true);
  const [newsletter, onNewsletterChange] = useState(true);
  const [image, setImage] = useState(null);

  const removeImage = async () => {
    await setImage(null);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const saveAllData = async () => {
    const afirstName = ["firstName", firstName];
    const alastName = ["lastName", lastName];
    const aemail = ["email", email];
    const aphoneNumber = ["phoneNumber", phoneNumber];
    const aorderStatuses = ["orderStatuses", JSON.stringify(orderStatuses)];
    const apasswordChanges = [
      "passwordChanges",
      JSON.stringify(passwordChanges),
    ];
    const aspecialOffers = ["specialOffers", JSON.stringify(specialOffers)];
    const anewsletter = ["newsletter", JSON.stringify(newsletter)];
    const aimage = ["image", image ? image : JSON.stringify(null)];
    const ars = [
      afirstName,
      alastName,
      aemail,
      aphoneNumber,
      aorderStatuses,
      apasswordChanges,
      aspecialOffers,
      anewsletter,
      aimage,
    ];
    await multiSet(ars);
  };

  const logOff = () => {
    clrerAll();
    signOut();
  };

  useEffect(() => {
    (async () => {
      let fname = await retrieveData("firstName");
      let aemail = await retrieveData("email");
      let alastName = await retrieveData("lastName");
      let aphoneNumber = await retrieveData("phoneNumber");
      let aorderStatuses = await retrieveData("orderStatuses");
      let apasswordChanges = await retrieveData("passwordChanges");
      let aspecialOffers = await retrieveData("specialOffers");
      let anewsletter = await retrieveData("newsletter");
      let aimage = await retrieveData("image");
      fname
        ? onFirstNameChange(fname)
        : console.log("Failed to fetch first name form async storage");

      aemail
        ? onEmailChange(aemail)
        : console.log("Failed for fetch email from async storage");

      alastName
        ? onLastNameChange(alastName)
        : console.log("Failed to fetch last Name from async storage");

      aphoneNumber ? onPhoneNumberChange(aphoneNumber) : null;
      aorderStatuses ? onOrderStatusesChange(JSON.parse(aorderStatuses)) : null;
      apasswordChanges
        ? onPasswordChangesChange(JSON.parse(apasswordChanges))
        : null;
      aspecialOffers ? onSpecialOffersChange(JSON.parse(aspecialOffers)) : null;
      anewsletter ? onNewsletterChange(JSON.parse(anewsletter)) : null;
      aimage ? setImage(aimage) : null;
    })();
  }, []);
  return (
    <ScrollView
      style={styles.main}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.personalInfo}>Personal Information</Text>
      <Text style={styles.avatarText}>Avatar</Text>
      <View style={styles.avatarView}>
        {image && image !== null ? (
          <Avatar.Image size={80} source={{ uri: image }} />
        ) : (
          <Avatar.Text size={80} label="JD" />
        )}
        <View>
          <Button
            style={styles.avatarButton}
            mode="text"
            compact={true}
            buttonColor="#495E57"
            textColor="white"
            onPress={pickImage}
          >
            Change
          </Button>
        </View>
        <View>
          <Button
            style={styles.avatarButton}
            mode="outlined"
            compact={true}
            textColor="#777"
            onPress={removeImage}
          >
            Remove
          </Button>
        </View>
      </View>

      {/* Form View */}

      <View style={styles.formView}>
        <Text style={styles.formText}>First Name</Text>
        <TextInput
          style={styles.formTextInput}
          mode="outlined"
          textColor="#777"
          value={firstName}
          onChangeText={onFirstNameChange}
        />
        <Text style={styles.formText}>Last Name</Text>
        <TextInput
          style={styles.formTextInput}
          mode="outlined"
          textColor="#777"
          value={lastName}
          onChangeText={onLastNameChange}
        />
        <Text style={styles.formText}>Email</Text>
        <TextInput
          style={styles.formTextInput}
          mode="outlined"
          textColor="#777"
          value={email}
          onChangeText={onEmailChange}
        />
        <Text style={styles.formText}>Phone Number</Text>
        <TextInput
          style={styles.formTextInput}
          mode="outlined"
          textColor="#777"
          render={(props) => (
            <MaskedTextInput mask="+1 (999) 999-999" {...props} />
          )}
          value={phoneNumber}
          onChangeText={onPhoneNumberChange}
          keyboardType="number-pad"
        />
      </View>

      {/* Email Notifications */}

      <View style={styles.emailNotificationsView}>
        <Text style={styles.emailNotificationsText}>Email Notifications</Text>
        <View style={styles.checkboxView}>
          <Checkbox
            status={orderStatuses ? "checked" : "unchecked"}
            onPress={() => onOrderStatusesChange(!orderStatuses)}
            color="green"
            uncheckedColor="#777"
          />
          <Text style={styles.checkboxText}>Order Statuses</Text>
        </View>
        <View style={styles.checkboxView}>
          <Checkbox
            status={passwordChanges ? "checked" : "unchecked"}
            onPress={() => onPasswordChangesChange(!passwordChanges)}
            color="green"
            uncheckedColor="#777"
          />
          <Text style={styles.checkboxText}>Password Changes</Text>
        </View>
        <View style={styles.checkboxView}>
          <Checkbox
            status={specialOffers ? "checked" : "unchecked"}
            onPress={() => onSpecialOffersChange(!specialOffers)}
            color="green"
            uncheckedColor="#777"
          />
          <Text style={styles.checkboxText}>Special Offers</Text>
        </View>
        <View style={styles.checkboxView}>
          <Checkbox
            status={newsletter ? "checked" : "unchecked"}
            onPress={() => onNewsletterChange(!newsletter)}
            color="green"
            uncheckedColor="#777"
          />
          <Text style={styles.checkboxText}>Newsletter</Text>
        </View>
      </View>
      <View style={styles.logoutView}>
        <Button buttonColor="#F4ce14" textColor="black" onPress={logOff}>
          Log Out
        </Button>
      </View>

      {/* Change Buttons */}

      <View style={styles.changeButtons}>
        <Button
          style={styles.changeButton}
          mode="outlined"
          compact={true}
          textColor="#777"
        >
          Discard Changes
        </Button>
        <Button
          style={styles.changeButton}
          mode="text"
          compact={true}
          buttonColor="#495E57"
          textColor="white"
          onPress={saveAllData}
        >
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    margin: 10,
  },
  personalInfo: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    // color: "#777",
  },
  avatarText: {
    color: "gray",
    marginTop: 10,
    marginBottom: 10,
  },
  avatarView: {
    // flex: 0.3,
    flexDirection: "row",
  },
  avatarButton: {
    marginTop: 30,
    marginLeft: 10,
    width: 120,
    height: 40,
  },
  formView: {
    flex: 0.85,
    marginTop: 10,
  },
  formTextInput: {
    height: 40,
    // color: "#777",
  },
  formText: {
    marginTop: 2,
    color: "#777",
  },
  checkboxView: {
    flexDirection: "row",
  },
  checkboxText: {
    marginTop: 9,
    color: "#777",
    fontSize: 15,
  },

  emailNotificationsView: {
    flex: 0.7,
    marginTop: 10,
  },
  emailNotificationsText: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
  },
  logoutView: {
    marginTop: 10,
  },
  changeButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  changeButton: {
    width: 150,
    margin: 10,
  },
});
