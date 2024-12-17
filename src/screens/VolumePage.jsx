import React, {useState} from 'react';
import {ImageBackground, FlatList} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import {SurahComponent} from '../components/SurahComponent';
export default function VolumePage({route}) {
  const {id, volumeData} = route.params;
  return (
    <>
      <CustomHeader text={'Volume ' + id} />
      <ImageBackground
        source={require('../assets/new1.jpg')}
        style={{flex: 1, paddingHorizontal: 20}}
        resizeMode="cover">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={volumeData}
          renderItem={({item, index}) => (
            <SurahComponent key={index} item={item} index={index} />
          )}
        />
      </ImageBackground>
    </>
  );
}
