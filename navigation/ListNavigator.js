import { createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ListsScreen from '../screens/ListsScreen';
import ListDetailScreen from '../screens/ListDetailScreen';

const ListNavigator = createStackNavigator({
  Lists: {
    screen: ListsScreen,
  },
  ListDetail: {
    screen: ListDetailScreen,
  },
});

export default createAppContainer(ListNavigator);