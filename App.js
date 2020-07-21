import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Colors from './constants/Colors';
import AppNavigator from './navigation/AppNavigator';

// improves performance of screen navs
enableScreens();

console.disableYellowBox = true;

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primaryColor,
    accent: Colors.accentColor,
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  body: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 25,
  },
});

export default App;
