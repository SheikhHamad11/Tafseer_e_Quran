import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CustomHeader from '../components/CustomHeader';
import {surah} from '../components/SurahList';
import {useNavigation} from '@react-navigation/native';

const AudioPlayer = ({route}) => {
  const {text, volumeData, SurahUrl} = route.params;

  return (
    <>
      <CustomHeader text={'Volume' + text} />
      <ImageBackground
        source={require('../assets/quran.jpg')}
        style={{flex: 1, padding: 20}}
        resizeMode="cover">
        <FlatList
          data={volumeData}
          renderItem={({item, index}) => (
            <VolumeDetails
              key={index}
              item={item}
              index={index}
              url={SurahUrl}
            />
          )}
        />
      </ImageBackground>
    </>
  );
};

const VolumeDetails = ({item, index, url}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('VolumePlay', {item, url})}>
      <Text style={styles.text}>
        {index + 1}. {item}
      </Text>
      <Icon name="download" color="black" size={20} />
    </TouchableOpacity>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'rgba(149, 129, 89, 0.9)',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
});
