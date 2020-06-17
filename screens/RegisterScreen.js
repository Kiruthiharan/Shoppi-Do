import React, {useState} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Button,
} from 'react-native';
import {Card} from 'native-base';
import {Input} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

function RegisterScreen(props) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const emailHandler = email => {
    setEnteredEmail(email);
  };

  const passwordHandler = password => {
    setEnteredPassword(password);
  };

  const registerHandler = () => {
    console.log(enteredEmail + ' ' + enteredPassword);
    auth()
      .createUserWithEmailAndPassword(enteredEmail, enteredPassword)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50}>
      <ScrollView>
        <Card style={styles.login}>
          <Input
            placeholder="Email"
            leftIcon={{type: 'font-awesome', name: 'user'}}
            onChangeText={emailHandler}
            value={enteredEmail}
          />
          <Input
            placeholder="Password"
            value={enteredPassword}
            onChangeText={passwordHandler}
          />
          <Button title="Register" onPress={registerHandler} />
          <Text>Forgot Password</Text>
          <Button
            title="Back to Login"
            onPress={() => {
              props.navigation.navigate('Login');
            }}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});

export default RegisterScreen;
