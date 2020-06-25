import React, {useState} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import Colors from '../constants/Colors';

function ProfileScreen(props) {
  return (
    <View style={styles.root}>
      <View>
        <Image
          source={require('../assets/images/profile-default.jpg')}
          style={styles.image}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput placeholder="UUserName" style={styles.input} />
        <TextInput placeholder="UUserName" style={styles.input} />
        <TextInput placeholder="UUserName" style={styles.input} />
      </View>
    </View>
  );
}

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
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    margin: 15,
    height: 40,
    width: 300,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
  },
});

export default ProfileScreen;
