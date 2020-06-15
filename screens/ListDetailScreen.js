import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LISTS} from '../data/dummy-data';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';

function ListDetailScreen(props) {
  const listId = props.navigation.getParam('listId');

  const selectedList = LISTS.find(list => list.id === listId);
  return (
    <View>
      <Text>List Detail</Text>
      <Text>{selectedList.title}</Text>
    </View>
  );
}

ListDetailScreen.navigationOptions = navigationData => {
  const listId = navigationData.navigation.getParam('listId');
  const selectedList = LISTS.find(list => list.id === listId);

  return {
    headerTitle: selectedList.title,
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item title="Fav" iconName="rocket" onPress={() => {}} />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({});

export default ListDetailScreen;
