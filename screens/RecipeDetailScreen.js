import React, {useState, useEffect} from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';

const user = auth().currentUser;

function RecipeDetailScreen(props) {
  const recipeId = props.navigation.getParam('recipeId');
  const [recipe, setRecipe] = useState({});
  const [ingredients, setIngredients] = useState([]);

  const dbRef = firestore()
    .collection('recipes')
    .doc(recipeId);

  useEffect(() => {
    dbRef.get().then(documentSnapshot => {
      const recipe = {
        name: documentSnapshot.data().name,
        recipe: documentSnapshot.data().recipe,
      };
      setRecipe(recipe)
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
      setIngredients(ingredients);
    });

    return () => {
      console.log('list');
    };
  }, [recipeId]);

  const renderIngredient = itemData => {
      return <ListItem key={itemData.item.id} rightTitle={itemData.item.qty} title={itemData.item.item}/>
  }

  return (
    <View style={styles.root}>
      <Text>{recipe.name}</Text>
      <Text>{recipe.recipe}</Text>
      <FlatList renderItem={renderIngredient} data={ingredients}/>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignContent: 'center',
    paddingHorizontal: 15,
  },
  dateTime: {
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '80%',
  },
});

export default RecipeDetailScreen;
