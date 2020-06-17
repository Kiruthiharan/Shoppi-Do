import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const NewList = props => {
  const [enteredList, setEnteredList] = useState('');

  const handleListName = listName => {
    setEnteredList(listName);
  };

  const handleSubmit = () => {
    props.addNew(enteredList);
    setEnteredList('');
    props.close();
  };
  return (
    <View >
      <View style={styles.closeContainer}>
        <TouchableOpacity style={styles.close} onPress={props.close}>
          <Icon name="x" color="white" size={30} />
        </TouchableOpacity>
      </View>
        <View style={styles.content}>

        
      <Text style={styles.contentTitle}>Add new List!</Text>
      <TextInput
        style={styles.input}
        value={enteredList}
        onChangeText={handleListName}
      />
      <Button onPress={handleSubmit} title="Add" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10
  },
  close: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    backgroundColor: '#FF0000',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    width: 100,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
});

export default NewList;
