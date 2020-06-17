import React, {useState, useEffect} from 'react';
import {
  CheckBox,
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import {LISTS} from '../data/dummy-data';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const user = auth().currentUser;

function ListDetailScreen(props) {
  const listId = props.navigation.getParam('listId');
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState('');
  const [list, setList] = useState('');

  const dbRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('Lists')
    .doc(listId);

  useEffect(() => {
    dbRef.get().then(documentSnapshot => {
      if (documentSnapshot.exists) {
        console.log('List data: ', documentSnapshot.data());
        setList(documentSnapshot.data());
      }
    });
    return () => {
      console.log(list);
    };
  }, [listId]);

  useEffect(() => {
    return dbRef.collection('items').onSnapshot(querySnapshot => {
      const items = [];
      querySnapshot.forEach(documentSnapshot => {
        items.push({
          id: documentSnapshot.id,
          name: documentSnapshot.data().name,
          done: documentSnapshot.data().done,
        });
      });

      setListItems(items);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  const handleItem = item => {
    setItem(item);
  };

  const addItem = () => {
    dbRef
      .collection('items')
      .add({
        name: item,
        done: false,
      })
      .then(() => {
        console.log('Item Added');
      });
    setItem('');
  };

  const toggleDone = (id, status) => {
    console.log(id, status);

    // dbRef
    // .collection('items').doc(id).update({
    //   done: !status
    // })
  };

  const renderListItem = itemData => {
    return (
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => toggleDone(itemData.item.id, itemData.item.done)}>
        <CheckBox
          value={itemData.item.done}
          onPress={() => toggleDone(itemData.item.id, itemData.item.done)}
        />
        <Text style={styles.title}>{itemData.item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View >
      <View>
        <FlatList data={listItems} renderItem={renderListItem} numColumns={1} />
      </View>
      <View style={styles.newItem}>
        <TextInput value={item} onChangeText={handleItem} />
        <Button title="Add" onPress={addItem} />
      </View>
    </View>
  );
}

// ListDetailScreen.navigationOptions = navigationData => {
//   const listId = navigationData.navigation.getParam('listId');
//   const selectedList = LISTS.find(list => list.id === listId);

//   return {
//     headerTitle: selectedList.title,
//     headerRight: () => (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item title="Fav" iconName="rocket" onPress={() => {}} />
//       </HeaderButtons>
//     ),
//   };
// };

const styles = StyleSheet.create({ 
  item: {
    flexDirection: 'row',
    borderWidth: 0.5,
    margin: 5,
    alignItems: 'center',
  },
  newItem: {
    flexDirection: 'row',
  },
});

export default ListDetailScreen;
