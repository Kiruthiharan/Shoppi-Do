import 'react-native-gesture-handler';
import { enableScreens} from 'react-native-screens';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import ListNavigator from './navigation/ListNavigator'

// improves performance of screen navs 
enableScreens();

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
