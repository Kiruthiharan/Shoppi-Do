import React, {useState} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

function ProfileScreen(props) {
  return (
    <View style={styles.root}>
      <Image
        source={require('../assets/images/profile-default.jpg')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: 'hidden',
    margin: 10
  },
});

export default ProfileScreen;
