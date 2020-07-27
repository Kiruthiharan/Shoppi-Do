import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const ChangePasswordScreen = props => {
  return (
    <View style={styles.root}>
      <Text>Change Password</Text>
      <TextInput style={styles.input}></TextInput>
      <TextInput style={styles.input}></TextInput>
      <TextInput style={styles.input}></TextInput>
      <Button>Change Passord</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    margin: 10
  }
})

export default ChangePasswordScreen;
