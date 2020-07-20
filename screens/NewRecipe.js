import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Label, DatePicker, Fab} from 'native-base';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const user = auth().currentUser;

function NewRecipeScreen(props) {
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState('');
  const [currentItem, setCurrentItem] = useState('');
  const [items, setItems] = useState([]);

  const handleName = name => {
    setName(name);
  };

  const handleRecipe = recipe => {
    setRecipe(recipe);
  };

  const handleCurrentItem = item => {
    setCurrentItem(item);
  };

  const handleItemList = item => {
    setItems(oldItems => [...oldItems, currentItem]);
  };

  const handleSubmit = () => {
    // dbRef.add({
    //   name: name,
    //   time: time,
    //   date: date
    // })
    console.log(name, recipe, items);
  };

  return (
    <View style={styles.root}>
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={handleName}
      />
      <TextInput
        label="Recipe"
        mode="outlined"
        value={recipe}
        onChangeText={handleRecipe}
      />
      <View style={styles.newItem}>
        <TextInput
          label="Item"
          mode="outlined"
          value={currentItem}
          onChangeText={handleCurrentItem}
          style={styles.item}
        />
        <TextInput
          label="Item"
          mode="outlined"
          value={currentItem}
          onChangeText={handleCurrentItem}
          style={styles.qty}
        />

        <TouchableOpacity
          onPress={handleItemList}
          style={{marginHorizontal: 15}}>
          <Icon name="plus" size={24} />
        </TouchableOpacity>
      </View>

      <Fab position="bottomRight" onPress={handleSubmit}>
        <Icon name="check" />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignContent: 'center',
    paddingHorizontal: 15,
  },
  newItem: {
    marginVertical: 10,
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
      flex: 2
  },
  qty: {
      flex: 1,
      marginLeft: 5
  }
});

export default NewRecipeScreen;
