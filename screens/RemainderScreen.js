import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Card, Fab} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/Colors';
import {Content, Form, Item, Label, Icon, Input, Spinner} from 'native-base';

const user = auth().currentUser;

function RemainderScreen(props) {
  const [loading, setLoading] = useState(true);
  const [remainders, setRemainders] = useState([]);

  const dbRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('Remainders');

  useEffect(() => {
    return dbRef.onSnapshot(querySnapshot => {
      const remainders = [];
      querySnapshot.forEach(doc => {
        console.log(doc);

        remainders.push({
          id: doc.id,
          name: doc.data().name,
          time: doc.data().time,
          date: doc.data().date,
        });
      });

      setRemainders(remainders);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  const renderGridItem = itemData => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.navigation.navigate({
            routeName: 'EditRemainder',
            params: {
              remainderId: itemData.item.id,
            },
          });
        }}>
        <Card style={styles.card}>
          <View>
            <Text style={styles.title}>{itemData.item.name}</Text>
            <View style={styles.dateTimeContainer}>
              <Text style={styles.footer}>{itemData.item.time}</Text>
              <Text style={styles.footer}>{itemData.item.date}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList data={remainders} renderItem={renderGridItem} numColumns={1} />
      <Fab
        position="bottomRight"
        onPress={() => props.navigation.navigate('NewRemainder')}>
        <Icon name="add" />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  card: {
    borderRadius: 5,
    elevation: 5,
    height: 50,
    marginHorizontal: 200,
  },
  dateTimeContainer: {
    flexDirection:'row',
    justifyContent: 'space-around'
  }
});

export default RemainderScreen;
