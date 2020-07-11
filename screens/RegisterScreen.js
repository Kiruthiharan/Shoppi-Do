import React, {useState} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/Colors';
import {Content, Form, Item, Label, Icon, Input, Spinner} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import {HelperText, TextInput} from 'react-native-paper';


function RegisterScreen(props) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredUserName, setEnteredUserName] = useState('');


  const emailHandler = email => {
    setEnteredEmail(email);
  };

  const passwordHandler = password => {
    setEnteredPassword(password);
  };

  const usernameHandler = username => {
    setEnteredUserName(username);
  };

  const registerHandler = () => {
    auth().signOut();
    auth()
      .createUserWithEmailAndPassword(enteredEmail, enteredPassword)
      .then(() => {
        console.log('User account created & signed in!');
        const user = auth().currentUser;
        const dbRef = firestore()
          .collection('users')
          .doc(user.uid);
        dbRef.set({username: enteredUserName});
        props.navigation.navigate('Login');
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
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={-300}>
      <ScrollView contentContainerStyle={styles.scroller}>
        <View style={styles.header}>
          <Text style={styles.text_header}>Get on Board!</Text>
        </View>
        <View style={styles.footer}>
          <Content>
            <Form>
              <Item floatingLabel>
                <Label style={styles.label}>Username</Label>
                <Input onChangeText={usernameHandler} />
              </Item>
              <HelperText style={styles.helper} type="error" visible={false}>
                Email address is invalid!
              </HelperText>
              <Item floatingLabel>
                <Label style={styles.label}>Email</Label>
                <Input onChangeText={emailHandler} value={enteredEmail} />
              </Item>
              <HelperText style={styles.helper} type="error" visible={false}>
                Email address is invalid!
              </HelperText>
              <Item floatingLabel error={false}>
                <Label style={styles.label}>Password</Label>
                <Input onChangeText={passwordHandler} value={enteredPassword} />
              </Item>
              <HelperText style={styles.helper} type="error" visible={false}>
                Email address is invalid!
              </HelperText>
              <Item floatingLabel error={false}>
                <Label style={styles.label}>Confirm Password</Label>
                <Input />
              </Item>
              <HelperText style={styles.helper} type="error" visible={false}>
                Email address is invalid!
              </HelperText>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={registerHandler}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={[Colors.accentColor, Colors.primaryColor]}
                    style={styles.linearGradient}>
                    <Text style={styles.loginText}>Register</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('Login')}>
                  <Text style={styles.registerContainer}>
                    <Text style={styles.register}> Back to Login</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Form>
            {/* <Spinner color='red' style={styles.loading}/> */}
          </Content>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroller: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 20,
  },
  footer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  label: {
    marginVertical: -10,
  },
  buttonContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  registerContainer: {
    alignSelf: 'center',
    marginTop: 25,
    fontSize: 15,
  },
  register: {
    color: Colors.accentColor,
  },
  linearGradient: {
    borderRadius: 25,
    elevation: 5,
    margin: 15,
    marginHorizontal: 20,
    paddingHorizontal: 100,
    paddingVertical: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 20,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    marginBottom: -15,
  },
});

export default RegisterScreen;
