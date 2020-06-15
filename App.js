import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import ListNavigator from './navigation/ListNavigator'

const App = () => {
  return (
    <ListNavigator />
  );
};

const styles = StyleSheet.create({
  body: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 25,
  },
});

export default App;
