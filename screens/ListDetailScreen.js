import React, {useState, useEffect} from 'react';
import {
  CheckBox,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Card} from 'native-base';
import {ScrollView} from 'react-native-gesture-handler';
import Swipeable from 'react-native-swipeable-row';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Colors';



function ListDetailScreen(props) {
  const listId = props.navigation.getParam('listId');
  const user = auth().currentUser;
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [doneList, setDoneList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  let itemInput = null;

  const dbRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('Lists')
    .doc(listId);

  useEffect(() => {
    dbRef.get().then(documentSnapshot => {
      if (documentSnapshot.exists) {
        setList(documentSnapshot.data());
      }
    });
    return () => {};
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
          qty: documentSnapshot.data().qty,
        };
        if (documentSnapshot.data().done) {
          doneItems.push(item);
        } else {
          pendingItems.push(item);
        }
        items.push(item);
      });

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

  const handleQty = qty => {
    setQty(qty);
  };

  const addItem = () => {
    dbRef
      .collection('items')
      .add({
        name: item,
        done: false,
        qty: qty,
      })
      .then(() => {
        console.log('Item Added');
      });
    setItem('');
    setQty('');
  };

  const deleteItem = id => {
    dbRef
      .collection('items')
      .doc(id)
      .delete()
      .then(() => console.log('deleted'));
  };

  const editItem = (list, color) => {
    dbRef
      .collection('items')
      .doc(currentItem.id)
      .set({
        name: item,
        qty: qty,
        done: currentItem.done,
      })
      .then(() => {
        console.log('List Edited');
      });
    setItem('');
    setQty('');
    setCurrentItem({});
    setEditMode(false);
  };

  const triggerEdit = item => {
    setEditMode(true);
    setItem(item.name);
    setQty(item.qty);
    setCurrentItem({id: item.id, done: item.done});
    itemInput.focus()
  };

  const cancelEdit = () => {
    setItem('');
    setQty('');
    setCurrentItem({});
    setEditMode(false);
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

  const renderItem = itemData => {
    const rightButtons = [
      <TouchableHighlight
        style={styles.slideIcon}
        onPress={() => deleteItem(itemData.item.id)}>
        <MaterialIcons name="delete" size={25} color={'#d11a2a'} />
      </TouchableHighlight>,
      <TouchableHighlight
        style={styles.slideIcon}
        onPress={() => triggerEdit(itemData.item)}>
        <MaterialIcons name="edit" size={25} color={'black'} />
      </TouchableHighlight>,
    ];
    return (
      <Swipeable rightButtons={rightButtons}>
        <View style={styles.todoGrid}>
          <Card>
            <TouchableOpacity
              style={styles.item}
              activeOpacity={0.7}
              onPress={() => toggleDone(itemData.item.id, itemData.item.done)}>
              <CheckBox
                value={itemData.item.done}
                onChange={() =>
                  toggleDone(itemData.item.id, itemData.item.done)
                }
              />
              <View style={styles.itemQty}>
                <Text
                  style={itemData.item.done ? styles.doneItem : styles.title}>
                  {itemData.item.name}
                </Text>
                <Text
                  style={itemData.item.done ? styles.doneItem : styles.title}>
                  {itemData.item.qty}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>
      </Swipeable>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.root}>
      <View style={styles.lists}>
        {pendingList.length === 0 && doneList.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>You have no Items</Text>
            <Text style={styles.emptyTitle}>Add an item to get Started</Text>
          </View>
        ) : null}

        {pendingList.length !== 0 ? (
          <View>
            <Text style={styles.heading}>Pending Items</Text>
            <FlatList
              data={pendingList}
              renderItem={renderItem}
              numColumns={1}
              contentContainerStyle={styles.list}
            />
          </View>
        ) : null}

        {doneList.length !== 0 ? (
          <View>
            <Text style={styles.heading}>Done Items</Text>
            <FlatList
              data={doneList}
              renderItem={renderItem}
              numColumns={1}
              contentContainerStyle={styles.list}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={item}
          onChangeText={handleItem}
          mode="outlined"
          label="Item"
          ref= {ref => itemInput = ref}
        />
        <TextInput
          style={styles.inputQty}
          value={qty}
          onChangeText={handleQty}
          mode="outlined"
          label="Qty"
        />
        <View style={styles.addBtn}>
          {editMode ? (
            <View style={styles.editContainer}>
              <Button
                mode="contained"
                onPress={editItem}
                disabled={item.length === 0}>
                Edit
              </Button>
              <Button
                style={styles.cancelBtn}
                icon="close-circle"
                color="red"
                mode="outline"
                onPress={cancelEdit}
              />
            </View>
          ) : (
            <Button
              mode="contained"
              onPress={addItem}
              disabled={item.length === 0}>
              Add
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

ListDetailScreen.navigationOptions = navigationData => {
  const title = navigationData.navigation.getParam('listName');
  console.log(navigationData);

  return {
    headerTitle: title,
    // headerRight: () => (
    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item title="Fav" iconName="rocket" onPress={() => {}} />
    //   </HeaderButtons>
    // ),
  };
};

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  editContainer: {
    flexDirection: 'row',
  },
  emptyTitle: {
    fontSize: 24,
  },
  cancelBtn: {
    marginLeft: 2,
  },
  info: {
    alignSelf: 'center',
  },
  list: {
    marginHorizontal: 5,
    alignContent: 'center',
    justifyContent: 'center',
  },
  lists: {
    flexGrow: 1,
    alignContent: 'center',
  },
  item: {
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 2,
    backgroundColor: 'white',
    margin: 5,
    padding: 10,
    height: 45,
  },
  inputQty: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    height: 45,
  },
  todoGrid: {
    paddingHorizontal: 5,
  },
  addBtn: {
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  doneItem: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  heading: {
    marginVertical: 10,
    fontSize: 18,
    alignSelf: 'center',
  },
  itemQty: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  slideIcon: {
    top: 15,
  },
});

export default ListDetailScreen;
