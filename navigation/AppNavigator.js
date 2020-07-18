import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Platform, View, Button} from 'react-native';
import ListsScreen from '../screens/ListsScreen';
import ListDetailScreen from '../screens/ListDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RemainderScreen from '../screens/RemainderScreen';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {SafeAreaView} from 'react-native-safe-area-view';
import NewRemainderScreen from '../screens/NewRemainderScreen';
import EditRemainderScreen from '../screens/EditRemainderScreen';

// header styles should change font
const NavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : '',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primaryColor,
};

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
    defaultNavigationOptions: NavOptions,
  },
);

const ProfileNavigator = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
    },
  },
  {
    defaultNavigationOptions: NavOptions,
  },
);

const RemainderNavigator = createStackNavigator(
  {
    Remainder: {
      screen: RemainderScreen,
    },
    NewRemainder: {
      screen: NewRemainderScreen,
    },
    EditRemainder: {
      screen: EditRemainderScreen,
    },
  },
  {
    defaultNavigationOptions: NavOptions,
  },
);

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Lists: {
      screen: ListNavigator,
      navigationOptions: {
        tabBarLabel: 'Lists',
        tabBarIcon: tabInfo => {
          return <Icon name="list-alt" size={23} color={tabInfo.tintColor} />;
        },
      },
    },
    Remainders: {
      screen: RemainderNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return <Icon name="bell" size={23} color={tabInfo.tintColor} />;
        },
        
      },
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return <Icon name="user" size={23} color={tabInfo.tintColor} />;
        },
        
      },
    },
  },
  {
    activeTintColor: Colors.accentColor,
    shifting: true
  },
);

const HomeNavigator = createDrawerNavigator({
  Profile: {
    screen: TabNavigator,
  },
  List: {
    screen: ListNavigator,
  },
});

const AuthNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
    },
    Register: {
      screen: RegisterScreen,
    },
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

const MainNavigator = createSwitchNavigator({
  Auth: {
    screen: AuthNavigator,
  },
  Home: {
    screen: HomeNavigator,
  },
});

export default createAppContainer(MainNavigator);
