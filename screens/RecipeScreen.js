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
import {Content, Form, Item, Label, Icon, Input, Spinner} from 'native-base';
import {ListItem} from 'react-native-elements';
import Colors from '../constants/Colors';



function RecipeScreen(props) {
  const user = auth().currentUser;
  const [loading, setLoading] = useState(true);
  const [remainders, setRemainders] = useState([]);

  const dbRef = firestore().collection('recipes');

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
              recipeName: itemData.item.name,
            },
          });
        }}>
        <LinearGradient
          end={{x: 0, y: 0}}
          start={{x: 1, y: 1}}
          colors={['#F02FC2', '#6094EA']}
          style={styles.linearGradient}>
          <View>
            <Text style={styles.title}>{itemData.item.name.toUpperCase()}</Text>
          </View>
        </LinearGradient>
        {/* <ListItem
          style={styles.recipeItem}
          key={itemData.item.id}
          title={itemData.item.name.toUpperCase()}
          chevron={true}
          underlayColor={Colors.accentColor}
        /> */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList data={remainders} renderItem={renderGridItem} numColumns={1} />
      <Fab
      style={{ backgroundColor: Colors.primaryColor }}
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
    margin: 5,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: Colors.primaryColor,
  },
  linearGradient: {
    flex: 1,
    borderRadius: 5,
    elevation: 5,
    marginTop: 15,
    height: 75,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    margin: 10,
  },
});

export default RecipeScreen;
