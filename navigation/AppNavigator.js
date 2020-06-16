import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Platform} from 'react-native';
import ListsScreen from '../screens/ListsScreen';
import ListDetailScreen from '../screens/ListDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const ListNavigator = createStackNavigator(
  {
    Lists: {
      screen: ListsScreen,
    },
    ListDetail: {
      screen: ListDetailScreen,
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : '',
      },
      headerTintColor:
        Platform.OS === 'android' ? 'white' : Colors.primaryColor,
    },
  },
);

const TabNavigator = createBottomTabNavigator({
  Lists: {
    screen: ListNavigator,
    navigationOptions: {
      tabBarLabel: 'Lists' ,
      tabBarIcon: (tabInfo) => {
        return <Icon name="list-alt" size={23} color ={tabInfo.tintColor}/>
      }
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Icon name="user" size={23} color ={tabInfo.tintColor}/>
      }
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: Colors.accentColor
  }
});

export default createAppContainer(TabNavigator);
