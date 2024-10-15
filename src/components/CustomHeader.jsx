import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import Header from './Modal';
export default function CustomHeader({text}) {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          backgroundColor: 'rgba(149, 129, 69, 0.7)',
          height: 50,
          padding: 10,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={'black'} />
        </TouchableOpacity>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
          }}>
          {text}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="ellipsis-v" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <Header modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </>
  );
}
