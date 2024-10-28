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
            return <Component key={index} id={item.vol_id} item={item} />;
          })}

          {/* {surah.map((item, index) => {
            return <SurahComponent key={index} item={item} />;
          })} */}
        </ScrollView>
      </ImageBackground>
    </>
  );
}

const Component = ({item, id}) => {
  const navigation = useNavigation();
  // const data = item.surah_data;
  const volumeData = item.surah_data.map((item, index) => {
    return item;
  });

  return (
    <Pressable
      onPress={() => navigation.navigate('VolumePage', {id, volumeData})}
      style={styles.row}>
      <Icon name="folder" size={20} color="black" />
      <View style={{marginLeft: 20}}>
        <Text style={{color: 'black', fontSize: 18}}>Volume {id}</Text>
      </View>
    </Pressable>
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
