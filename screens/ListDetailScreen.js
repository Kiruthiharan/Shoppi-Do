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
import {Card} from 'native-base';

const user = auth().currentUser;

function ListDetailScreen(props) {
  const listId = props.navigation.getParam('listId');
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState('');
  const [list, setList] = useState('');
  const [doneList, setDoneList] = useState([]);
  const [pendingList, setPendingList] = useState([]);

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
      const doneItems = [];
      const pendingItems = [];
      querySnapshot.forEach(documentSnapshot => {
        const item = {
          id: documentSnapshot.id,
          name: documentSnapshot.data().name,
          done: documentSnapshot.data().done,
        };
        if (documentSnapshot.data().done) {
          doneItems.push(item);
        } else {
          pendingItems.push(item);
        }
        items.push(item);
      });

      setListItems(items);
      setDoneList(doneItems);
      setPendingList(pendingItems);

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

    dbRef
      .collection('items')
      .doc(id)
      .update({
        done: !status,
      });
  };

  const renderDoneItem = itemData => {
    return (
      <Card style={styles.todoGrid}>
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => toggleDone(itemData.item.id, itemData.item.done)}>
          <CheckBox
            value={itemData.item.done}
            onChange={() => toggleDone(itemData.item.id, itemData.item.done)}
          />
          <Text style={styles.title}>{itemData.item.name}</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  const renderPendingItem = itemData => {
    return (
      <Card style={styles.todoGrid}>
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={() => toggleDone(itemData.item.id, itemData.item.done)}>
          <CheckBox
            value={itemData.item.done}
            onChange={() => toggleDone(itemData.item.id, itemData.item.done)}
          />
          <Text style={styles.doneItem}>{itemData.item.name}</Text>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.root}>
      <Text style={{marginVertical: 15}}>Pending Items</Text>
      <FlatList  data={pendingList} renderItem={renderDoneItem} numColumns={1} />
      <Text style={{marginTop: -200}} >Done Items</Text>
      <FlatList data={doneList} renderItem={renderPendingItem} numColumns={1} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={item}
          onChangeText={handleItem}
        />
        <View style={styles.addBtn}>
          <Button title="Add" onPress={addItem} />
        </View>
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
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  item: {
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 30,
    padding: 10,
  },
  todoGrid: {
    flex: 1,
  },
  addBtn: {
    marginHorizontal: 5,
  },
  doneItem: {textDecorationLine: 'line-through', textDecorationStyle: 'solid'},
});

export default ListDetailScreen;
