import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Label, DatePicker, Fab, Card} from 'native-base';
import {TextInput, FAB} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FlatList} from 'react-native-gesture-handler';
import {ListItem} from 'react-native-elements';

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
        owner: documentSnapshot.data().owner,
      };
      setRecipe(recipe);
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
    <View style={styles.root}>
      <Text style={styles.heading}>Instructions</Text>
      <Card style={styles.recipeContainer}>
        <Text>{recipe.recipe}</Text>
      </Card>

      <Text style={styles.heading}>Ingredients</Text>
      <FlatList
        renderItem={renderIngredient}
        data={ingredients}
        contentContainerStyle={styles.ingredients}
      />
      {recipe.owner === user.uid ? (
        <Fab
          position="bottomRight"
          onPress={() => {
            props.navigation.navigate({
              routeName: 'RecipeEdit',
              params: {
                recipeId: recipeId,
              },
            });
          }}>
          <Icon name="edit-2" />
        </Fab>
      ) : null}
    </View>
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
  ingredients: {
    flexGrow: 1,
    maxHeight: '50%',
  },
  recipeContainer: {
    marginBottom: 15,
    padding: 10,
  },
  heading: {
    textAlign: 'center',
    paddingBottom: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;
