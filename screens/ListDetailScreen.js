import React, {useState} from 'react';
import {
  CheckBox,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {LISTS} from '../data/dummy-data';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

function ListDetailScreen(props) {
  const listId = props.navigation.getParam('listId');

  const selectedList = LISTS.find(list => list.id === listId);

  const renderListItem = itemData => {
    return (
      <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={() => {}}>
          <CheckBox value={true} onValueChange={() => {}} />
          <Text style={styles.title}>{itemData.item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList data={LISTS} renderItem={renderListItem} numColumns={1} />
    </View>
  );
}

ListDetailScreen.navigationOptions = navigationData => {
  const listId = navigationData.navigation.getParam('listId');
  const selectedList = LISTS.find(list => list.id === listId);

  return {
    headerTitle: selectedList.title,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title="Fav" iconName="rocket" onPress={() => {}} />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0.5,
    margin:5,
    alignItems: 'center'
  }
});

export default ListDetailScreen;
