import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Card, Fab} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/Colors';
import {Content, Form, Item, Label, Icon, Input, Spinner} from 'native-base';
import {ListItem} from 'react-native-elements';

const user = auth().currentUser;

function RecipeScreen(props) {
  const [loading, setLoading] = useState(true);
  const [remainders, setRemainders] = useState([]);

  const dbRef = firestore()
    .collection('recipes');

  useEffect(() => {
    return dbRef.onSnapshot(querySnapshot => {
      const remainders = [];
      querySnapshot.forEach(doc => {
        console.log(doc);

        remainders.push({
          id: doc.id,
          name: doc.data().name,
          recipe: doc.data().recipe,
        });
      });

      setRemainders(remainders);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  const renderGridItem = itemData => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.navigation.navigate({
            routeName: 'RecipeDetail',
            params: {
              recipeId: itemData.item.id,
              recipeName: itemData.item.name
            },
          });
        }}>
        <ListItem 
        style={styles.recipeItem}
        key={itemData.item.id}
        title={itemData.item.name}
        chevron={true}/>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList data={remainders} renderItem={renderGridItem} numColumns={1} />
      <Fab
        position="bottomRight"
        onPress={() => props.navigation.navigate('NewRecipe')}>
        <Icon name="add" />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  card: {
    borderRadius: 5,
    elevation: 5,
    height: 50,
    marginHorizontal: 200,
  },
  recipeItem: {
    margin:5,
    marginHorizontal: 10
  },
  dateTimeContainer: {
    flexDirection:'row',
    justifyContent: 'space-around'
  }
});

export default RecipeScreen;
