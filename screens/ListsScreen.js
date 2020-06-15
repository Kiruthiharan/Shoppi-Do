import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import {LISTS} from '../data/dummy-data';

function ListsScreen(props) {
  const renderGridItem = itemData => {
    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => {
          props.navigation.navigate({
            routeName: 'ListDetail',
            params: {listId: itemData.item.id},
          });
        }}>
        <View>
          <Text>{itemData.item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return <FlatList data={LISTS} renderItem={renderGridItem} numColumns={2} />;
}

// optional for like setting heeaders
ListsScreen.navigationOptions = {
  headerTitle: 'Shopping Lists',
};

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 15,
    height: 100,
  },
});

export default ListsScreen;
