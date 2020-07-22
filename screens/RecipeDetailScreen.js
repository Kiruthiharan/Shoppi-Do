import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Label, DatePicker, Fab, Card} from 'native-base';
import {TextInput, FAB, Button} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FlatList} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';
import Colors from '../constants/Colors';
import Spinner from 'react-native-loading-spinner-overlay';

function RecipeDetailScreen(props) {
  const user = auth().currentUser;
  const recipeId = props.navigation.getParam('recipeId');
  const [recipe, setRecipe] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true)
  const dbRef = firestore()
    .collection('recipes')
    .doc(recipeId);

  useEffect(() => {
    dbRef.get().then(documentSnapshot => {
      const recipe = {
        name: documentSnapshot.data().name,
        recipe: documentSnapshot.data().recipe,
        owner: documentSnapshot.data().owner,
      };
      setRecipe(recipe);
    }).then(() => setLoading(false))

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
    })

    return () => {
      console.log('list');
    };
  }, [recipeId]);

  const addToList = () => {
    const listDbRef = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('Lists');

    listDbRef
      .add({
        name: recipe.name,
        color: 'purple',
      })
      .then(docRef => {
        console.log(docRef.id);
        ingredients.forEach(ingredient => {
          listDbRef
            .doc(docRef.id)
            .collection('items')
            .add({
              name: ingredient.item,
              done: false,
              qty: ingredient.qty,
            });
        });
        props.navigation.navigate('Lists');
      });
  };

  const renderIngredient = itemData => {
    return (
      <ListItem
        key={itemData.item.id}
        rightTitle={itemData.item.qty}
        title={itemData.item.item}
        bottomDivider
      />
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.root}
      keyboardShouldPersistTaps="always">
      <Spinner visible={loading} textContent={'Loading...'} />
      <Text style={styles.heading}>Instructions</Text>
      
      <View style={styles.recipeContainer}>
        <Text style={styles.instructions}>{recipe.recipe}</Text>
      </View>

      <Text style={styles.heading}>Ingredients</Text>
      <FlatList
        renderItem={renderIngredient}
        data={ingredients}
        contentContainerStyle={styles.ingredients}
      />
      <View style={styles.actionsContainer}>
        <Button icon="plus" onPress={addToList}>
          Add ing. to list
        </Button>
        {recipe.owner === user.uid ? (
          <Button
            icon="pencil"
            onPress={() => {
              props.navigation.navigate({
                routeName: 'RecipeEdit',
                params: {
                  recipeId: recipeId,
                },
              });
            }}>
            Edit List
          </Button>
        ) : null}
      </View>
    </ScrollView>
  );
}

RecipeDetailScreen.navigationOptions = navigationData => {
  const title = navigationData.navigation.getParam('recipeName');
  return {
    headerTitle: title,
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignContent: 'center',
    padding: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  instructions: {
    fontSize: 18,
  },
  ingredients: {
    flexGrow: 1,
    maxHeight: '50%',
  },
  recipeContainer: {
    backgroundColor: 'white',
    marginBottom: 15,
    padding: 10,
  },
  heading: {
    textAlign: 'center',
    paddingBottom: 5,
    fontSize: 20,
  },
});

export default RecipeDetailScreen;
