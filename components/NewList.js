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
import {Input} from 'native-base';
import {RadioButton} from 'react-native-paper';

const NewList = props => {
  const [enteredList, setEnteredList] = useState('');
  const [checked, setChecked] = useState('blue');

  const handleListName = listName => {
    setEnteredList(listName);
  };

  const handleSubmit = () => {
    props.addNew(enteredList, checked);
    setEnteredList('');
    props.close();
  };

  return (
    <View>
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
        <View style={styles.colorInput}>
          <Text>Color: </Text>
          <RadioButton
            value="blue"
            status={checked === 'blue' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('blue')}
            color="#4c79fb"
            uncheckedColor="#4c79fb"
          />
          <RadioButton
            value="green"
            status={checked === 'green' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('green')}
            color="#48cc64"
            uncheckedColor="#48cc64"
          />
          <RadioButton
            value="yellow"
            status={checked === 'yellow' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('yellow')}
            color="#fdbb00"
            uncheckedColor="#fdbb00"
          />
          <RadioButton
            value="purple"
            status={checked === 'purple' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('purple')}
            color="#9f50e3"
            uncheckedColor="#9f50e3"
          />
        </View>
        <Button onPress={handleSubmit} title="Add" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -25,
    zIndex: 100,
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
    paddingTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    width: '60%',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  colorInput: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center'
  },
});

export default NewList;
