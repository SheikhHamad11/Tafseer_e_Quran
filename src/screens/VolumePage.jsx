import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import CustomHeader from '../components/CustomHeader';

export default function VolumePage({route}) {
  const {text} = route.params;
  return (
    <>
      <CustomHeader text={text} />
      <ImageBackground
        source={require('../../src/assets/quran.jpg')}
        style={{flex: 1, padding: 20}}
        resizeMode="cover"></ImageBackground>
    </>
  );
}
