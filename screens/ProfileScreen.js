import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {TextInput, RadioButton, Button} from 'react-native-paper';
import Colors from '../constants/Colors';
import {DatePicker, Fab} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

function ProfileScreen(props) {
  const user = auth().currentUser;
  const [editable, setEditable] = useState(false);
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  const dbRef = firestore()
    .collection('users')
    .doc(user.uid);

  useEffect(() => {
    getFromDb();
    return () => {
      console.log('list');
    };
  }, []);

  const getFromDb = () => {
    dbRef.get().then(documentSnapshot => {
      if (documentSnapshot.exists) {
        console.log('List data: ', documentSnapshot.data());
        setUsername(documentSnapshot.data().username);
        setContact(documentSnapshot.data().contact);
        setDob(documentSnapshot.data().DOB);
        if (documentSnapshot.data().DOB === undefined) {
          setDob("Select Date");
        }
        setGender(documentSnapshot.data().gender);
      } else {
        console.log('No data');
      }
    });
  };

  const saveToDb = () => {
    dbRef.update({
      username: username,
      contact: contact,
      DOB: dob,
      gender: gender,
    });
    setEditable(!editable);
  };

  const revertChanges = () => {
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
    <ScrollView contentContainerStyle={styles.root}>
      <RenderFAB />

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
            <DatePicker style={styles.date} disabled={!editable} onDateChange={handleDate} />
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
          <Button  onPress={saveToDb} mode="contained" >Update</Button>
        ) : null}
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
    backgroundColor: '#f6f6f6'
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileScreen;
