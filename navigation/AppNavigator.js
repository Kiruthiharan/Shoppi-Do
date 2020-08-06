import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Platform} from 'react-native';
import ListsScreen from '../screens/ListsScreen';
import ListDetailScreen from '../screens/ListDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RecipeScreen from '../screens/RecipeScreen';
import EditRecipeScreen from '../screens/EditRecipeScreen'
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/Feather';
import NewRecipeScreen from '../screens/NewRecipeScreen';


// header styles should change font
const NavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.headerColor : '',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.headerColor,
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
    ChangePassword: {
      screen: ChangePasswordScreen
    }
  },
  {
    defaultNavigationOptions: NavOptions,
  },
);

const RemainderNavigator = createStackNavigator(
  {
    Recipes: {
      screen: RecipeScreen,
    },
    NewRecipe: {
      screen: NewRecipeScreen,
    },
    RecipeDetail: {
      screen: RecipeDetailScreen,
    },
    RecipeEdit: {
      screen: EditRecipeScreen,
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
          return <Icon name="list" size={23} color={tabInfo.tintColor} />;
        },
        tabBarColor: Colors.headerColor
      },
    },
    Remainders: {
      screen: RemainderNavigator,
      navigationOptions: {
        tabBarLabel: 'Recipes',
        tabBarIcon: tabInfo => {
          return <Icon name="coffee" size={23} color={tabInfo.tintColor} />;
        },
        tabBarColor: Colors.headerColor
        
      },
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return <Icon name="user" size={23} color={tabInfo.tintColor} />;
        },
        tabBarColor: Colors.headerColor
      },
    },
  },
  {
    activeTintColor: Colors.headerColor,
    shifting: true,
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
