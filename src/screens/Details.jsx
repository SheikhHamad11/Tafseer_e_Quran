import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
export default function About() {
  return (
    <>
      <CustomHeader text={'Tafheem-ul-Quran'} />
      <ImageBackground
        source={require('../../src/assets/quran.jpg')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.contentContainer}>
          <Component text="Volume 1" />
          <Component text="Volume 2" />
          <Component text="Volume 3" />
          <Component text="Volume 4" />
          <Component text="Volume 5" />
          <Component text="Volume 6" />
        </View>
      </ImageBackground>
    </>
  );
}

const Component = ({text}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate('VolumePage', {text})}
      style={styles.row}>
      <Icon name="folder" size={20} color="black" />
      <View style={{marginLeft: 20}}>
        <Text style={{color: 'black', fontSize: 18}}>{text}</Text>
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
    backgroundColor: 'rgba(149, 129, 69, 0.5)',
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
