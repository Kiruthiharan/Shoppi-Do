import React, {createRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import FAB from '../components/UI/FAB';

import {Colors} from '../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import Swipeable from 'react-native-swipeable-row';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from 'react-native-actions-sheet';
import Modal from 'react-native-modal';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import List from '../models/list';
import {Fab} from 'native-base';
import NewList from '../components/NewList';
import EditList from '../components/EditList';

const user = auth().currentUser;

function ListsScreen(props) {
  const dbRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('Lists');
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  async function addList(list, color) {
    dbRef
      .add({
        name: list,
        color: color
      })
      .then(() => {
        console.log('List Added');
      });
    setEnteredList('');
    toggleModal();
  }

  async function editList(list, color) {
    dbRef.doc(currentItem.id)
      .set({
        name: list,
        color: color
      })
      .then(() => {
        console.log('List Edited');
      });
    setEnteredList('');
    toggleEdit();
  }

  useEffect(() => {
    return dbRef.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const single = new List(doc.id, doc.data().name, doc.data().color);
        list.push(single);
      });

      setLists(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <Text>loading....</Text>;
  }

  const deleteItem = id => {
    dbRef
      .doc(id)
      .delete()
      .then(() => console.log('deleted'));
  };

  const updateItem = item => {
    setCurrentItem(item)
    toggleEdit()
  };

  const renderGridItem = itemData => {
    const leftContent = <Text>Pull to activate</Text>;
    const rightButtons = [
      <TouchableHighlight
        style={styles.slideIcon}
        onPress={() => deleteItem(itemData.item.id)}>
        <MaterialIcons name="delete" size={25} color={'#d11a2a'} />
      </TouchableHighlight>,
      <TouchableHighlight
        style={styles.slideIcon}
        onPress={() => updateItem(itemData.item)}>
        <MaterialIcons name="edit" size={25} color={'black'} />
      </TouchableHighlight>,
    ];

    return (
      <Swipeable leftContent={leftContent} rightButtons={rightButtons}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            props.navigation.navigate({
              routeName: 'ListDetail',
              params: {
                listId: itemData.item.id,
              },
            });
          }}
          onLongPress={() => console.log('long')}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#39A1F7', '#718BFB', '#A875FF']}
            style={styles.linearGradient}>
            <View>
              <Text style={styles.title}>{itemData.item.title}</Text>
              <Text style={styles.footer}>{itemData.item.color}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleEdit = () => {
    setIsEditMode(!isEditMode);
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.root}
      keyboardVerticalOffset={-300}>
      <FlatList data={lists} renderItem={renderGridItem} numColumns={1} />
      <FAB name="plus" onPress={toggleModal} />

      <Modal
        isVisible={isModalVisible}
        avoidKeyboard={true}
        onBackButtonPress={toggleModal}
        style={styles.modal}>
        <NewList close={toggleModal} addNew={addList} />
      </Modal>
      <Modal
        isVisible={isEditMode}
        avoidKeyboard={true}
        onBackButtonPress={toggleEdit}
        style={styles.modal}>
        <EditList close={toggleEdit} item={currentItem} editList={editList} />
      </Modal>
    </KeyboardAvoidingView>
  );
}

// optional for like setting heeaders
ListsScreen.navigationOptions = navigationData => {
  return {
    headerTitle: 'Shopping Lists',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Fav"
          iconName="navicon"
          onPress={() => {
            navigationData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gridItem: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    borderRadius: 5,
    elevation: 5,
    margin: 15,
    height: 100,
    marginHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    margin: 10,
  },
  footer: {
    top: 30,
    paddingRight: 10,
    color: 'white',
    alignSelf: 'flex-end',
  },
  slideIcon: {
    top: 50,
  },
  addList: {
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  input: {
    width: 100,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
});

export default ListsScreen;
