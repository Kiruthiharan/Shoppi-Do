import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Label, DatePicker, Fab, Card} from 'native-base';
import {TextInput} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Colors from '../constants/Colors';
import {ScrollView} from 'react-native-gesture-handler';

function EditRecipeScreen(props) {
  const user = auth().currentUser;
  const recipeId = props.navigation.getParam('recipeId');
  const [name, setName] = useState('');
  const [recipe, setRecipe] = useState('');
  const [currentItem, setCurrentItem] = useState('');
  const [currentQty, setCurrentQty] = useState('');
  const [items, setItems] = useState([]);

  const dbRef = firestore()
    .collection('recipes')
    .doc(recipeId);

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

  const addItem = () => {
    const newItem = {id: Math.random(), item: currentItem, qty: currentQty};
    dbRef.collection('ingredients').add({
      item: currentItem,
      qty: currentQty,
    });
    setItems(oldItems => [...oldItems, newItem]);
    setCurrentItem('')
    setCurrentQty('')
  };

  const deleteItem = item => {
    dbRef
      .collection('ingredients')
      .doc(item.id)
      .delete();
  };

  useEffect(() => {
    dbRef.get().then(documentSnapshot => {
      console.log(documentSnapshot);
      setName(documentSnapshot.data().name);
      setRecipe(documentSnapshot.data().recipe);
    });

    dbRef.collection('ingredients').onSnapshot(querySnapshot => {
      const ingredients = [];
      querySnapshot.forEach(doc => {
        ingredients.push({
          id: doc.id,
          item: doc.data().item,
          qty: doc.data().qty,
        });
      });
      setItems(ingredients);
    });

    return () => {
      console.log('list');
    };
  }, [recipeId]);

  const renderRecipeItem = itemData => {
    return (
      <View style={styles.itemCardContainer}>
        <Card style={styles.itemCard}>
          <Text>{itemData.item.item}</Text>
          <Text>{itemData.item.qty}</Text>
        </Card>

        <TouchableOpacity
          onPress={() => deleteItem(itemData.item)}
          style={{marginHorizontal: 15}}>
          <Icon name="minus" size={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleSubmit = () => {
    dbRef.update({
      name: name,
      recipe: recipe,
      owner: user.uid,
    });
    props.navigation.navigate('Recipes');
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
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
          onPress={addItem}
          style={{marginHorizontal: 15}}
          disabled={currentItem.length === 0}>
          <Icon name="plus" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList data={items} renderItem={renderRecipeItem} numColumns={1} />
      <Fab
        style={{backgroundColor: Colors.primaryColor}}
        position="bottomRight"
        onPress={handleSubmit}>
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
});

export default EditRecipeScreen;
