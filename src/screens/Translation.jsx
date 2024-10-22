import {
  View,
  Text,
  ImageBackground,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import React, {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';
import CustomHeader from '../components/CustomHeader';
import {surah} from '../components/SurahList';
import {useNavigation} from '@react-navigation/native';
import {Urdu_data} from '../components/UrduTranslation';
const SurahName = Urdu_data.map(item => item);
console.log('SurahName', SurahName);
export default function Translation({route}) {
  const {text} = route.params;
  return (
    <>
      <CustomHeader text={text} />
      <ImageBackground
        source={require('../../src/assets/quran.jpg')}
        style={{flex: 1, paddingHorizontal: 20}}
        resizeMode="cover">
        <FlatList
          data={SurahName}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <SurahComponent key={index} item={item} />
          )}
        />
        {/* <ScrollView showsVerticalScrollIndicator={false}>
          {surah.map((item, index) => {
            return <SurahComponent key={index} item={item} />;
          })}
        </ScrollView> */}
      </ImageBackground>
    </>
  );
}

const SurahComponent = ({item}) => {
  const [downloading, setDownloading] = useState(false);
  const data = item.surah_data;
  console.log(data);
  const volumeData = data.map((item, index) => {
    return item.surah_name;
  });
  console.log('volumeData', volumeData);
  const SurahName = volumeData.map(item => item);
  console.log(SurahName);

  let sound;
  // Load the sound when the component mounts
  const getAudio = () => {
    // Load audio file from the app bundle
    sound = new Sound(item.url, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        // playAudio();
        return;
      }
      playAudio();
      console.log('Sound loaded successfully');
    });
    // Clean up the sound on unmount
    return () => {
      sound.release(); // Release the resource when the component unmounts
    };
  };

  const playAudio = () => {
    if (sound) {
      sound?.play(success => {
        if (success) {
          console.log('Successfully played the sound');
        } else {
          console.log('Playback failed');
        }
      });
    } else {
      getAudio();
    }
  };

  const pauseAudio = () => {
    sound.pause(() => {
      console.log('Audio paused');
    });
  };

  const stopAudio = () => {
    sound.stop(() => {
      console.log('Audio stopped');
    });
  };

  // Download audio function
  const downloadAudio = async => {
    setDownloading(true);

    const audioUrl = item.url;
    // 'http://download.quranurdu.com/Tafheem-ul-Quran%20by%20Syed%20Moududi/volume01/(0003)fateha/surahe%20fateha.mp3'; // Replace with actual audio file URL
    const downloadDest = `${RNFS.DownloadDirectoryPath}/audio.mp3`; // Android: Download folder

    RNFS.downloadFile({
      fromUrl: audioUrl,
      toFile: downloadDest,
    })
      .promise.then(res => {
        setDownloading(false);
        Alert.alert(
          'Download complete',
          'Audio has been downloaded successfully!',
        );
        console.log('File downloaded to:', downloadDest);
      })
      .catch(err => {
        setDownloading(false);
        Alert.alert(
          'Download failed',
          'An error occurred while downloading the file.',
        );
        console.log(err);
      });
  };
  const navigation = useNavigation();
  const name = item.title;
  const url = item.url;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PlayAudio', {
          playAudio,
          pauseAudio,
          stopAudio,
          name,

          downloadAudio,
        })
      }
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
        <Text style={{color: 'black', fontSize: 18}}>{SurahName}</Text>
      </View>
      <View style={{flexDirection: 'row', gap: 10}}>
        {/* <TouchableOpacity onPress={pauseAudio}>
          <Icon name="pause" color="black" size={20} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={downloadAudio}>
          {downloading ? (
            <Icon name="spinner" color="black" size={25} />
          ) : (
            <Icon name="download" color="black" size={25} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
