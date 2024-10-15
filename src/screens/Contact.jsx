import {View, Text, ImageBackground, Pressable, Linking} from 'react-native';
import React from 'react';
import CustomHeader from '../components/CustomHeader';

export default function Contact() {
  return (
    <>
      <CustomHeader text="Contact" />
      <ImageBackground
        source={require('../../src/assets/quran.jpg')}
        style={{flex: 1, padding: 20}}
        resizeMode="cover">
        <Text style={{color: 'black', fontSize: 16}}>
          Please contact us at:
        </Text>
        <Pressable
          onPress={() => Linking.openURL(`mailto:Developers@espinsight.com`)}>
          <Text style={{color: 'black', fontSize: 18, fontWeight: 500}}>
            Developers@espinsight.com
          </Text>
        </Pressable>
      </ImageBackground>
    </>
  );
}
