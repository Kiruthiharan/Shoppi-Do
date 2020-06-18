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
import {Card} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import Colors from '../constants/Colors';
import {Content, Form, Item, Label, Icon, Input} from 'native-base';

function LoginScreen(props) {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const emailHandler = email => {
    setEnteredEmail(email);
  };

  const passwordHandler = password => {
    setEnteredPassword(password);
  };

  const loginHandler = () => {
    console.log(enteredEmail, enteredPassword);

    // auth()
    //   .signInWithEmailAndPassword(enteredEmail, enteredPassword)
    //   .then(() => {
    //     props.navigation.navigate('Home');
    //   })
    //   .catch(error => {
    //     if (error.code === 'auth/email-already-in-use') {
    //       console.log('That email address is already in use!');
    //     }

    //     if (error.code === 'auth/invalid-email') {
    //       console.log('That email address is invalid!');
    //     }

    //     console.error(error);
    //   });
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={-300}>
      <ScrollView contentContainerStyle={styles.scroller}>
        <View style={styles.header}>
          <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <View style={styles.footer}>
          <Content>
            <Form>
              <Item floatingLabel>
                <Label style={styles.label}>Username</Label>
                <Input onChangeText={emailHandler} value={enteredEmail} underlineColorAndroid={"red"} />
              </Item>
              <Item floatingLabel error={false}>
                <Label style={styles.label}>Password</Label>
                <Input onChangeText={passwordHandler} value={enteredPassword} />
              </Item>
              {/* <Text Style={{color: 'red'}}>Error</Text> */}
              <TouchableOpacity>
                <Text style={styles.forgot}>Forgot password?</Text>
              </TouchableOpacity>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={loginHandler}>
                  <LinearGradient
                    colors={[Colors.accentColor, Colors.primaryColor]}
                    style={styles.linearGradient}>
                    <Text style={styles.loginText}>Log In</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('Register')}>
                  <Text style={styles.registerContainer}>
                    New here? <Text style={styles.register}> Register</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Form>
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
    paddingTop: 50,
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
    alignItems: 'center',
  },
  forgot: {
    color: Colors.accentColor,
    margin: 15,
    paddingTop: 10,
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
    borderRadius: 5,
    elevation: 5,
    margin: 15,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loginText: {
    color: 'white',
    fontSize: 20,
  },
});

export default LoginScreen;
