import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import {TextInput, RadioButton, Button} from 'react-native-paper';
import Colors from '../constants/Colors';
import {DatePicker, Fab} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import Spinner from 'react-native-loading-spinner-overlay';

function ProfileScreen(props) {
  const user = auth().currentUser;
  const [editable, setEditable] = useState(false);
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);

  var dbRef;

  useEffect(() => {
    dbRef = firestore()
      .collection('users')
      .doc(user.uid);
    getFromDb();
    return () => {
      console.log('list');
    };
  }, []);

  const getFromDb = () => {
    dbRef
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('List data: ', documentSnapshot.data());
          setUsername(documentSnapshot.data().username);
          setContact(documentSnapshot.data().contact);
          setDob(documentSnapshot.data().DOB);
          if (documentSnapshot.data().DOB === undefined) {
            setDob('Select Date');
          }
          setGender(documentSnapshot.data().gender);
        } else {
          console.log('No data');
        }
      })
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  };

  const saveToDb = () => {
    dbRef = firestore()
      .collection('users')
      .doc(user.uid);
    dbRef.update({
      username: username,
      contact: contact,
      DOB: dob,
      gender: gender,
    });
    setEditable(!editable);
  };

  const revertChanges = () => {
    dbRef = firestore()
    .collection('users')
    .doc(user.uid);
    getFromDb();
    setEditable(!editable);
  };

  const toggleEdit = () => {
    setEditable(!editable);
  };

  const handleDate = date => {
    setDob(date);
  };

  const handleContact = contact => {
    setContact(contact);
  };

  const handleUsername = username => {
    setUsername(username);
  };

  async function deleteAccount() {
    Alert.alert(
      'Are you sure!',
      'Are you sure you want to delete your account? ',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async function() {
            setLoading(true);
            var user = firebase.auth().currentUser;
            var userId = user.uid;
            await firebase
              .firestore()
              .collection('users')
              .doc(userId)
              .delete();
            await firebase
              .firestore()
              .collection('recipes')
              .where('owner', '==', userId)
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(query => {
                  firebase
                    .firestore()
                    .collection('recipes')
                    .doc(query.id)
                    .delete();
                });
              });
            await user
              .delete()
              .then(function() {
                console.log('delete successful?');
                setLoading(false);
                props.navigation.navigate('Auth');
              })
              .catch(function(error) {
                setLoading(false);
                Alert.alert(error);
              });
          },
        },
      ],
      {cancelable: false},
    );
  }

  const RenderFAB = () => {
    if (!editable) {
      return (
        <Fab
          position="topRight"
          style={{backgroundColor: Colors.primaryColor}}
          onPress={toggleEdit}>
          <Icon name="edit-2" />
        </Fab>
      );
    } else {
      return (
        <Fab
          position="topRight"
          style={{backgroundColor: Colors.warningColor}}
          onPress={revertChanges}>
          <Icon name="x" />
        </Fab>
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.root}
      keyboardShouldPersistTaps="always">
      <RenderFAB />
      <Spinner visible={loading} textContent={'Loading...'} />
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          label="Username"
          style={styles.input}
          disabled={!editable}
          value={username}
          onChangeText={handleUsername}
        />
        <TextInput
          mode="outlined"
          label="Contact No"
          style={styles.input}
          selectionColor={Colors.primaryColor}
          disabled={!editable}
          value={contact}
          onChangeText={handleContact}
        />
        <View style={styles.rowContainer}>
          <Text>Date of Birth </Text>
          <View style={styles.datePicker}>
            <DatePicker
              style={styles.date}
              disabled={!editable}
              onDateChange={handleDate}
            />
          </View>
        </View>
        <View style={styles.rowContainer}>
          <Text>Gender</Text>
          <RadioButton.Group
            onValueChange={value => setGender(value)}
            value={gender}>
            <View style={styles.genderContainer}>
              <Text>Male</Text>
              <RadioButton value="Male" disabled={!editable} />
            </View>
            <View style={styles.genderContainer}>
              <Text>Female</Text>
              <RadioButton value="Female" disabled={!editable} />
            </View>
          </RadioButton.Group>
        </View>
        {editable === true ? (
          <Button onPress={saveToDb} mode="contained">
            Update
          </Button>
        ) : null}
      </View>
      <View style={styles.accountActions}>
        <Button
          onPress={() => {
            props.navigation.navigate('ChangePassword');
          }}
          mode="outlined"
          style={styles.actionBtn}>
          Change Password
        </Button>
        <Button
          onPress={deleteAccount}
          mode="outlined"
          style={styles.actionBtn}
          color={Colors.warningColor}>
          Delete Account
        </Button>
      </View>
    </ScrollView>
  );
}

ProfileScreen.navigationOptions = navigationData => {
  return {
    headerTitle: 'My Profile',
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Fav"
          iconName="log-out"
          onPress={() => {
            auth()
              .signOut()
              .then(navigationData.navigation.navigate('Auth'));
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    margin: 10,
  },
  inputContainer: {
    justifyContent: 'center',
  },
  input: {
    margin: 15,
    width: 300,
    height: 50,
    borderColor: Colors.primaryColor,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: '#c5c5c5',
    flex: 1,
    marginLeft: 15,
    backgroundColor: '#f6f6f6',
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountActions: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'space-between',
    marginTop: 20,
  },
  actionBtn: {
    margin: 10,
  },
});

export default ProfileScreen;
