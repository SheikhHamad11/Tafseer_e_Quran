import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import {surah} from '../components/SurahList';
import {Volume} from '../components/VolumeList';
export default function Component1() {
  return (
    <>
      <CustomHeader text={'Tafheem-ul-Quran'} />
      <ImageBackground
        source={require('../../src/assets/quran.jpg')}
        style={styles.background}
        resizeMode="cover">
        <ScrollView style={styles.contentContainer}>
          {Volume.map((item, index) => {
            return <Component key={index} text={item.vol_id} item={item} />;
          })}

          {/* {surah.map((item, index) => {
            return <SurahComponent key={index} item={item} />;
          })} */}
        </ScrollView>
      </ImageBackground>
    </>
  );
}

const Component = ({item, text}) => {
  const navigation = useNavigation();
  const data = item.surah_data;
  const volumeData = data.map((item, index) => {
    return item.surah_name;
  });
  const SurahUrl = data.map((item, index) => {
    return item.url;
  });
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('VolumePage', {text, volumeData, SurahUrl})
      }
      style={styles.row}>
      <Icon name="folder" size={20} color="black" />
      <View style={{marginLeft: 20}}>
        <Text style={{color: 'black', fontSize: 18}}>Volume {text}</Text>
      </View>
    </Pressable>
  );
};

const SurahComponent = ({item}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('VolumePage', {item})}
      style={{
        backgroundColor: 'rgba(149, 129, 89, 0.9)',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 10,
      }}>
      <View style={{flexDirection: 'row', gap: 10}}>
        <Text style={{color: 'black', fontSize: 18}}>{item.id}.</Text>
        <Text style={{color: 'black', fontSize: 18}}>{item.title}</Text>
      </View>
      <View style={{flexDirection: 'row', gap: 10}}>
        {/* <TouchableOpacity onPress={pauseAudio}>
        <Icon name="pause" color="black" size={20} />
      </TouchableOpacity> */}
        {/* <TouchableOpacity>
          {downloading ? (
            <Icon name="spinner" color="black" size={25} />
          ) : (
            <Icon name="download" color="black" size={25} />
          )}
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    // justifyContent: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  row: {
    backgroundColor: 'rgba(149, 129, 89, 0.9)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  image: {
    width: 30,
    height: 30,
  },
});
