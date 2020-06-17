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
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import FAB from '../components/UI/FAB';

import {Colors} from '../constants/Colors';
import LinearGradient from 'react-native-linear-gradient';
import Swipeable from 'react-native-swipeable-row';
import Icon from 'react-native-vector-icons/Feather';
import ActionSheet from 'react-native-actions-sheet';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import List from '../models/list';

const actionSheetRef = createRef();

function RenderAddList(props) {
  return (
    <ScrollView>
      <FAB name="x" />
      <TextInput>Hello</TextInput>
    </ScrollView>
  );
}

const user = auth().currentUser;

function ListsScreen(props) {
  const dbRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('Lists');
  const [enteredList, setEnteredList] = useState('');
  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);

  const handleListName = listName => {
    setEnteredList(listName);
  };

  async function addList() {
    dbRef
      .add({
        name: enteredList,
      })
      .then(() => {
        console.log('List Added');
      });
    setEnteredList('');
  }

  useEffect(() => {
    return dbRef.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const single = new List(doc.id, doc.data().name, 'red');
        list.push(single);
      });

      setLists(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <Text>Aasd</Text>;
  }

  const leftContent = <Text>Pull to activate</Text>;

  const rightButtons = [
    <TouchableHighlight style={styles.slideIcon}>
      <Icon name="delete" size={25} />
    </TouchableHighlight>,
    <TouchableHighlight style={styles.slideIcon}>
      <Icon name="edit" size={25} />
    </TouchableHighlight>,
  ];

  const renderGridItem = itemData => {
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
          }}>
          <LinearGradient
            colors={['#39A1F7', '#718BFB', '#A875FF']}
            style={styles.linearGradient}>
            <View>
              <Text style={styles.title}>{itemData.item.title}</Text>
              <Text style={styles.footer}>{itemData.item.title}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.root} keyboardVerticalOffset={-300}>
      <TextInput value={enteredList} onChangeText={handleListName} />
      <Button title="Add" onPress={addList} />
      <FlatList data={lists} renderItem={renderGridItem} numColumns={1} />
      <FAB
        name="plus"
        onPress={() => {
          actionSheetRef.current?.setModalVisible();
        }}
      />
      <ActionSheet ref={actionSheetRef} keyboardShouldPersistTaps="never">
        <RenderAddList />
      </ActionSheet>
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
});

export default ListsScreen;
