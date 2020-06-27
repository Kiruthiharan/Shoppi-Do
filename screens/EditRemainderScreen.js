import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {Label, DatePicker, Fab} from 'native-base';
import {TextInput} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/Feather';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const user = auth().currentUser;

function EditRemainderScreen(props) {
  const remainderId = props.navigation.getParam('remainderId');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const dbRef = firestore()
    .collection('users')
    .doc(user.uid)
    .collection('Remainders')
    .doc(remainderId);

  useEffect(() => {
    dbRef.get().then(documentSnapshot => {
      console.log(documentSnapshot);
      setDate(documentSnapshot.data().date)
      setTime(documentSnapshot.data().time)
      setName(documentSnapshot.data().name)
    });

    return () => {
      console.log('list');
    };
  }, [remainderId]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = date => {
    hideDatePicker();
    setDate(date.toString().substr(4, 12));
  };

  const handleTimeConfirm = time => {
    hideTimePicker();
    setTime(time.toString().substr(16, 5));
  };

  const handleName = name => {
    setName(name);
  };

  const handleSubmit = () => {
    dbRef.update({
      name: name,
      time: time,
      date: date,
    });
  };

  return (
    <View style={styles.root}>
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={handleName}
      />
      <View style={styles.dateTime}>
        <View style={styles.dateContainer}>
          <TextInput
            label="Date"
            mode="outlined"
            disabled={true}
            value={date}
            style={styles.input}
          />

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
          <TouchableOpacity
            onPress={showDatePicker}
            style={{marginHorizontal: 15}}>
            <Icon name="calendar" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.timeContainer}>
          <TextInput
            label="Time"
            mode="outlined"
            disabled={true}
            value={time}
            style={styles.input}
          />
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />
          <TouchableOpacity
            onPress={showTimePicker}
            style={{marginHorizontal: 15}}>
            <Icon name="clock" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <Fab position="bottomRight" onPress={handleSubmit}>
        <Icon name="check" />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignContent: 'center',
    paddingHorizontal: 15,
  },
  dateTime: {
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '80%',
  },
});

export default EditRemainderScreen;
