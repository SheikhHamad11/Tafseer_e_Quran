import { ImageBackground, FlatList } from 'react-native';
import React from 'react';
import CustomHeader from '../components/CustomHeader';
import { Urdu_data } from '../components/UrduTranslation';
import { SurahComponent } from '../components/SurahComponent';
export default function Translation({ route }) {
  const { text, id } = route.params;
  const category = Urdu_data.find(item => item.cat_id === id);

  return (
    <>
      <CustomHeader text={text} />
      <ImageBackground
        source={require('../../src/assets/new1.jpg')}
        style={{ flex: 1, paddingHorizontal: 20 }}
        resizeMode="cover">
        <FlatList
          data={category.surah_data}
          // keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={10}
          renderItem={({ item, index }) => (
            <SurahComponent cat_id={category?.cat_id} key={index} item={item} index={index} />
          )}
        />
      </ImageBackground>
    </>
  );
}
