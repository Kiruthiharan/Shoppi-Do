import React, {useState} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Image,
  Button
} from 'react-native';
import {TextInput, RadioButton} from 'react-native-paper';
import Colors from '../constants/Colors';
import {DatePicker, } from 'native-base';

function ProfileScreen(props) {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View>
        <Image
          source={require('../assets/images/profile-default.jpg')}
          style={styles.image}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput mode="outlined" label="Username" style={styles.input} />
        <TextInput
          mode="outlined"
          label="Contact No"
          style={styles.input}
          selectionColor={Colors.primaryColor}
        />
        <View style={styles.rowContainer}>
          <Text>Date of Birth </Text>
          <View style={styles.datePicker}>
            <DatePicker placeHolderText="Select" />
          </View>
        </View>
        <View style={styles.rowContainer}>
          <Text>Gender</Text>
          <RadioButton.Group>
            <View style={styles.genderContainer}>
              <Text>Male</Text>
              <RadioButton value="Male" />
            </View>
            <View style={styles.genderContainer}>
              <Text>Female</Text>
              <RadioButton value="Female" />
            </View>
          </RadioButton.Group>
        </View>
        <Button title="Edit"/>
      </View>
    </ScrollView>
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
    marginVertical: 10
  },
  datePicker: {
    borderWidth: 1,
    flex: 1,
    marginLeft: 15
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default ProfileScreen;
