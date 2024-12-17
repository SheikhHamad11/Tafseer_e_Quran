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
          backgroundColor: 'rgba(180, 142, 87, 0.8)',
          height: 50,
          // padding: 10,
          paddingHorizontal: 20,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{marginLeft: 5}}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={25} color={'black'} />
        </TouchableOpacity>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
          }}>
          {text}
        </Text>
        <TouchableOpacity
          style={{marginLeft: 10, paddingHorizontal: 10}}
          onPress={() => setModalVisible(true)}>
          <Icon name="ellipsis-v" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <Header modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </>
  );
}
