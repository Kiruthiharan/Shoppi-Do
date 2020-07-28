import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {TextInput, Button, HelperText} from 'react-native-paper';
import {firebase} from '@react-native-firebase/firestore';
import Spinner from 'react-native-loading-spinner-overlay';

const ChangePasswordScreen = props => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [conPassword, setConPassword] = useState('');

  const [oldValid, setOldValid] = useState(false);
  const [newValid, setNewValid] = useState(false);
  const [conValid, setConValid] = useState(false);

  const [oldError, setOldError] = useState('');
  const [newError, setNewError] = useState('');
  const [conError, setConError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleOldPassword = password => {
    if (password.length === 0) {
      setOldError('Password cannot be empty');
      setOldValid(false);
    } else if (password.length < 4) {
      setOldError('Password too short');
      setOldValid(false);
    } else {
      setOldError('');
      setOldValid(true);
    }
    setOldPassword(password);
  };

  const handleNewPassword = password => {
    if (password.length === 0) {
      setNewError('Password cannot be empty');
      setNewValid(false);
    } else if (password.length < 7) {
      setNewError('Password too short');
      setNewValid(false);
    } else {
      setNewError('');
      setNewValid(true);
    }
    setNewPassword(password);
  };

  const handleConPassword = password => {
    if (password.length === 0) {
      setConError('Password cannot be empty');
      setConValid(false);
    } else if (password.length < 7) {
      setConError('Password too short');
      setConValid(false);
    } else {
      setConError('');
      setConValid(true);
    }

    if (password !== newPassword) {
      setConValid(false);
      setConError('Passwords do not Match');
    } else {
      setConValid(true);
      setConError('');
    }

    setConPassword(password);
  };

  const handleSubmit = () => {
    setLoading(true);
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      oldPassword,
    );
    user
      .reauthenticateWithCredential(cred)
      .then(() => {
        var user = firebase.auth().currentUser;
        user
          .updatePassword(newPassword)
          .then(() => {
            Alert.alert('Password updated!');
            props.navigation.navigate('Profile');
            setLoading(false);
          })
          .catch(error => {
            setLoading(false);
            Alert.alert(error);
          });
      })
      .catch(error => {
        setLoading(false);
        Alert.alert(error.message);
      });
  };

  return (
    <View style={styles.root}>
      <Spinner visible={loading} textContent={'Loading...'} />
      <Text style={styles.heading}>CHANGE PASSWORD</Text>
      <TextInput
        mode="outlined"
        label="Old Password"
        style={styles.input}
        secureTextEntry={true}
        value={oldPassword}
        onChangeText={handleOldPassword}
      />
      <HelperText style={styles.helper} type="error" visible={!oldValid}>
        {oldError}
      </HelperText>
      <TextInput
        mode="outlined"
        label="New Password"
        style={styles.input}
        secureTextEntry={true}
        value={newPassword}
        onChangeText={handleNewPassword}
      />
      <HelperText style={styles.helper} type="error" visible={!newValid}>
        {newError}
      </HelperText>
      <TextInput
        mode="outlined"
        label="Confirm Password"
        style={styles.input}
        secureTextEntry={true}
        value={conPassword}
        onChangeText={handleConPassword}
      />
      <HelperText style={styles.helper} type="error" visible={!conValid}>
        {conError}
      </HelperText>
      <Button
        mode="contained"
        style={styles.btn}
        onPress={handleSubmit}
        disabled={!(oldValid && newValid && conValid)}>
        Change Password
      </Button>
    </View>
  );
};

ChangePasswordScreen.navigationOptions = navigationData => {
  return {
    headerTitle: 'Change Password',
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    alignSelf: 'center',
    fontSize: 24,
    margin: 20,
  },
  input: {
    marginHorizontal: 35,
  },
  helper: {
    marginHorizontal: 25,
  },
  btn: {
    margin: 20,
    width: '60%',
    alignSelf: 'center',
  },
});

export default ChangePasswordScreen;
