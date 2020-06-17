import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Swipeable from 'react-native-swipeable-row';
import Icon from 'react-native-vector-icons/Feather';

const ListGrid = itemData => {
  const leftContent = <Text>Pull to activate</Text>;
  const rightButtons = [
    <TouchableHighlight
      style={styles.slideIcon}
      onPress={() => deleteItem(itemData.item.id)}>
      <Icon name="delete" size={25} />
    </TouchableHighlight>,
    <TouchableHighlight style={styles.slideIcon}>
      <Icon name="edit" size={25} />
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

export default ListGrid;
