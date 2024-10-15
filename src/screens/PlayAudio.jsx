import {
  View,
  Text,
  ImageBackground,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../components/CustomHeader';
import Icon from 'react-native-vector-icons/FontAwesome6';
export default function PlayAudio({route}) {
  const {playAudio, pauseAudio, stopAudio, downloadAudio, getAudio, name} =
    route.params;
  const [downloading, setDownloading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <CustomHeader text={name} />
      <ImageBackground
        source={require('../../src/assets/quran.jpg')}
        style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20}}
        resizeMode="cover">
        {!name ? (
          <Text>loading</Text>
        ) : (
          <View>
            {!isPlaying ? (
              <TouchableOpacity
                disabled={isPlaying}
                onPress={() => {
                  setIsPlaying(true);
                  playAudio();
                }}
                style={styles.row}>
                <Icon name="play" color="black" size={20} />
                <Text style={styles.text}>Play </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={!isPlaying}
                onPress={() => {
                  setIsPlaying(false);
                  pauseAudio();
                }}
                style={styles.row}>
                <Icon name="pause" color="black" size={20} />
                <Text style={styles.text}>Pause </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={stopAudio} style={styles.row}>
              <Icon name="stop" color="black" size={20} />
              <Text style={styles.text}>Stop </Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'rgba(149, 129, 89, 0.9)',
    padding: 10,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
