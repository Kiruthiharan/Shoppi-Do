import React, {useState, useEffect} from 'react';
import {
  CheckBox,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import {LISTS} from '../data/dummy-data';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import {TextInput} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Card} from 'native-base';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ScrollView} from 'react-native-gesture-handler';

const user = auth().currentUser;

function ListDetailScreen(props) {
  const listId = props.navigation.getParam('listId');
  const [listItems, setListItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
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
    props.navigation.setParams({listName: list.name})
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

  const toggleDone = (id, status) => {
    console.log(id, status);

    dbRef
      .collection('items')
      .doc(id)
      .update({
        done: !status,
      });
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
          <View style={styles.itemQty}>
            <Text style={styles.title}>{itemData.item.name}</Text>
            <Text style={styles.title}>{itemData.item.qty}</Text>
          </View>
        </TouchableOpacity>
      </Card>
    );
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
          <View style={styles.itemQty}>
            <Text style={styles.doneItem}>{itemData.item.name}</Text>
            <Text style={styles.doneItem}>{itemData.item.qty}</Text>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.root} >
      <View style={styles.lists}>
        <View>
          <Text style={styles.heading}>Pending Items</Text>
          <FlatList
            data={pendingList}
            renderItem={renderPendingItem}
            numColumns={1}
            contentContainerStyle={styles.list}
          />
          {pendingList.length === 0 ? (
            <Text style={styles.info}> *No pending items</Text>
          ) : null}
        </View>

        {doneList.length === 0 ? null : (
          <View>
            <Text style={styles.heading}>Done Items</Text>
            <FlatList
              data={doneList}
              renderItem={renderDoneItem}
              numColumns={1}
              contentContainerStyle={styles.list}
            />
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={item}
          onChangeText={handleItem}
          mode="outlined"
          label="Item"
        />
        <TextInput
          style={styles.inputQty}
          value={qty}
          onChangeText={handleQty}
          mode="outlined"
          label="Qty"
        />
        <View style={styles.addBtn}>
          <Button title="Add" onPress={addItem} />
        </View>
      </View>
    </ScrollView>
  );
}

ListDetailScreen.navigationOptions = navigationData => {
  const title = navigationData.navigation.getParam('listName');
  console.log(navigationData)

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
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  addBtn: {
    marginHorizontal: 5,
    height: 45,
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
});

export default ListDetailScreen;
