import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

import LinearGradient from 'react-native-linear-gradient';
import Swipeable from 'react-native-swipeable-row';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import List from '../models/list';
import NewList from '../components/NewList';
import EditList from '../components/EditList';
import Colors from '../constants/Colors';
import {Fab, Icon} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

function ListsScreen(props) {
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  let swiperRef = [];
  const user = auth().currentUser;

  const dbRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('Lists');

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

  async function addList(list, color) {
    dbRef
      .add({
        name: list,
        color: color,
      })
      .then(() => {
        console.log('List Added');
      });
    setEnteredList('');
    toggleModal();
  }

  async function editList(list, color) {
    dbRef
      .doc(currentItem.id)
      .set({
        name: list,
        color: color,
      })
      .then(() => {
        console.log('List Edited');
      });
    setEnteredList('');
    toggleEdit();
  }

  if (loading) {
    return <Spinner visible={loading} textContent={'Loading...'} />;
  }

  const deleteItem = id => {
    dbRef
      .doc(id)
      .delete()
      .then(() => console.log('deleted'));
  };

  const updateItem = item => {
    setCurrentItem(item);
    swiperRef[item.id].recenter();
    toggleEdit();
  };

  const renderGridItem = itemData => {
    const rightButtons = [
      <TouchableHighlight
        style={styles.slideIcon}
        onPress={() => deleteItem(itemData.item.id)}>
        <MaterialIcons name="delete" size={25} color={Colors.warningColor} />
      </TouchableHighlight>,
      <TouchableHighlight
        style={styles.slideIcon}
        onPress={() => updateItem(itemData.item)}>
        <MaterialIcons name="edit" size={25} color={'black'} />
      </TouchableHighlight>,
    ];
    let listColor = [];
    if (itemData.item.color === 'yellow') {
      listColor = Colors.yellowGradient;
    } else if (itemData.item.color === 'blue') {
      listColor = Colors.blueGradient;
    } else if (itemData.item.color === 'purple') {
      listColor = Colors.purpleGradient;
    } else if (itemData.item.color === 'green') {
      listColor = Colors.greenGradient;
    }

    return (
      <Swipeable
        rightButtons={rightButtons}
        ref={ref => (swiperRef[itemData.item.id] = ref)}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            props.navigation.navigate({
              routeName: 'ListDetail',
              params: {
                listId: itemData.item.id,
                listName: itemData.item.title,
              },
            });
          }}
          onLongPress={() => console.log('long')}>
          <LinearGradient
            end={{x: 0, y: 0}}
            start={{x: 1, y: 1}}
            colors={listColor}
            style={styles.linearGradient}>
            <View>
              <Text style={styles.title}>{itemData.item.title}</Text>
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
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.root}
      keyboardVerticalOffset={-300}>
      {lists.length !== 0 ? (
        <FlatList data={lists} renderItem={renderGridItem} numColumns={1} />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>You have no lists</Text>
          <Text style={styles.emptyTitle}>Click on + to get Started</Text>
        </View>
      )}

      <Fab
        style={{backgroundColor: Colors.primaryColor}}
        position="bottomRight"
        onPress={toggleModal}>
        <Icon name="add" />
      </Fab>
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Fav"
          iconName="log-out"
          onPress={() => {
            auth()
              .signOut()
              .then(navigationData.navigation.navigate('Auth'));
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
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyTitle: {
    fontSize: 24,
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
    fontSize: 24,
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
