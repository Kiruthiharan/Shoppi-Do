import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Label, DatePicker, Fab, Card} from 'native-base';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FlatList} from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

function NewRecipeScreen(props) {
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState('');
  const [currentItem, setCurrentItem] = useState('');
  const [currentQty, setCurrentQty] = useState('');
  const [items, setItems] = useState([]);
  const user = auth().currentUser;
  const dbRef = firestore().collection('recipes');

  const handleName = name => {
    setName(name);
  };

  const handleRecipe = recipe => {
    setRecipe(recipe);
  };

  const handleCurrentItem = item => {
    setCurrentItem(item);
  };

  const handleCurrentQty = qty => {
    setCurrentQty(qty);
  };

  const handleItemList = item => {
    const newItem = {id: Math.random(), item: currentItem, qty: currentQty};
    setItems(oldItems => [...oldItems, newItem]);
    setCurrentItem('');
    setCurrentQty('');
  };

  const deleteItem = deleteItem => {
    const newList = items.filter(item => {
      return item.id != deleteItem.id;
    });
    setItems(newList);
  };

  const handleSubmit = () => {
    dbRef
      .add({
        name: name,
        recipe: recipe,
        owner: user.uid,
      })
      .then(docRef => {
        console.log(docRef.id);
        items.forEach(item => {
          dbRef
            .doc(docRef.id)
            .collection('ingredients')
            .add({
              item: item.item,
              qty: item.qty,
            });
        });
        props.navigation.navigate('Recipes');
      })
      .catch(error => {
        console.error(error);
      });

    console.log(name, recipe, items);
  };

  const renderRecipeItem = itemData => {
    return (
      <View style={styles.itemCardContainer}>
        <Card style={styles.itemCard}>
          <Text>{itemData.item.item}</Text>
          <Text>{itemData.item.qty}</Text>
        </Card>

        <TouchableOpacity
          onPress={deleteItem.bind(this, itemData.item)}
          style={{marginHorizontal: 15}}>
          <Icon name="minus" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.root}
      keyboardShouldPersistTaps="always">
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
        multiline={true}
        style={styles.recipeInput}
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
          label="Qty"
          mode="outlined"
          value={currentQty}
          onChangeText={handleCurrentQty}
          style={styles.qty}
        />

        <TouchableOpacity
          onPress={handleItemList}
          style={{marginHorizontal: 15}}
          disabled={currentItem.length === 0}>
          <Icon name="plus" size={24} />
        </TouchableOpacity>
      </View>
      <FlatList data={items} renderItem={renderRecipeItem} numColumns={1} />
      <Fab
        style={{backgroundColor: Colors.primaryColor}}
        position="bottomRight"
        onPress={handleSubmit}
        disabled={
          name.length === 0 || recipe.length === 0 || items.length === 0
        }>
        <Icon name="check" />
      </Fab>
    </ScrollView>
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
    flex: 2,
  },
  qty: {
    flex: 1,
    marginLeft: 5,
  },
  itemCard: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemCardContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  recipeInput: {
    maxHeight: '50%',
  },
});

export default NewRecipeScreen;
