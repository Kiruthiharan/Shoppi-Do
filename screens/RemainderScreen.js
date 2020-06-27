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
import {Card, Fab} from 'native-base';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/Colors';
import {Content, Form, Item, Label, Icon, Input, Spinner} from 'native-base';

function RemainderScreen(props) {
  return (
    <View style={styles.root}>
      <Fab position="bottomRight" onPress={() => props.navigation.navigate('RemainderDetail')}>
        <Icon name="add" />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RemainderScreen;
