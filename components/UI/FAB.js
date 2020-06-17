import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

const FAB = props => {
  return (
    <TouchableOpacity style={styles.TouchableOpacityStyle} {...props} >
      <Icon name={props.name} color="white" size={30}/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    borderRadius: 30,
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    backgroundColor: Colors.primaryColor
  },
  FABStyle: {
    
  },
});

export default FAB;
