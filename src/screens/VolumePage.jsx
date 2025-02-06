import React, { useState } from 'react';
import { ImageBackground, FlatList } from 'react-native';
import CustomHeader from '../components/CustomHeader';
import { SurahComponent } from '../components/SurahComponent';
export default function VolumePage({ route }) {
  const { cat_id, volumeData } = route.params;
  return (
    <>
      <CustomHeader text={'Volume ' + (parseInt(cat_id) - 3)} />
      <ImageBackground
        source={require('../assets/new1.jpg')}
        style={{ flex: 1, paddingHorizontal: 20 }}
        resizeMode="cover">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={volumeData}
          renderItem={({ item, index }) => (
            <SurahComponent cat_id={cat_id} key={index} item={item} index={index} />
          )}
        />
      </ImageBackground>
    </>
  );
}
