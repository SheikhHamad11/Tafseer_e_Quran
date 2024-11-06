import { View, Text, ImageBackground, Alert, TouchableOpacity, FlatList, Platform, ActivityIndicator, ToastAndroid, StyleSheet, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import React, { useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import CustomHeader from '../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { Urdu_data } from '../components/UrduTranslation';
import FileViewer from 'react-native-file-viewer';
export default function Translation({ route }) {
  const { text, id } = route.params;
  const category = Urdu_data.find(item => item.cat_id === id);

  return (
    <>
      <CustomHeader text={text} />
      <ImageBackground
        source={require('../../src/assets/quran.jpg')}
        style={{ flex: 1, paddingHorizontal: 20 }}
        resizeMode="cover">
        <FlatList
          data={category.surah_data}
          // keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={10}
          renderItem={({ item, index }) => (
            <SurahComponent key={index} item={item} index={index} />
          )}
        />
      </ImageBackground>
    </>
  );
}

const SurahComponent = ({ item, index }) => {
  const [downloading, setDownloading] = useState(false);
  // Download audio function
  // const downloadAudio = async => {
  //   setDownloading(true);

  //   const audioUrl = item.url;
  //   // console.log('item.url', audioUrl);
  //   // ( 'http://download.quranurdu.com/Tafheem-ul-Quran%20by%20Syed%20Moududi/volume01/(0003)fateha/surahe%20fateha.mp3',);
  //   const downloadDest = `${RNFS.DownloadDirectoryPath}/${item.surah_name}.mp3`; // Android: Download folder

  //   RNFS.downloadFile({
  //     fromUrl: audioUrl,
  //     toFile: downloadDest,
  //   })
  //     .promise.then(res => {
  //       setDownloading(false);
  //       Alert.alert(
  //         'Download complete',
  //         `${item.surah_name} has been downloaded successfully!`,
  //       );
  //       console.log('File downloaded to:', downloadDest);
  //     })
  //     .catch(err => {
  //       setDownloading(false);
  //       Alert.alert(
  //         'Download failed',
  //         'An error occurred while downloading the file.',
  //       );
  //       console.log(err);
  //     });
  // };
  const navigation = useNavigation();
  const name = item.surah_name;
  const showToast = () => {
    ToastAndroid.showWithGravity(
      'Your Download has Started',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  };

  const downloadAudio = async () => {
    try {
      setDownloading(true);
      showToast();
      const audioUrl = item.url;
      let downloadDest;

      if (Platform.OS === 'android' && Platform.Version >= 33) {
        // Android 13+; save to internal directory
        downloadDest = `${RNFS.DocumentDirectoryPath}/${item.surah_name}.mp3`;
      } else {
        // Older Android versions or iOS
        downloadDest = `${RNFS.DownloadDirectoryPath}/${item.surah_name}.mp3`;
      }

      // Download the audio file
      await RNFS.downloadFile({
        fromUrl: audioUrl,
        toFile: downloadDest,
      }).promise;

      setDownloading(false);
      console.log('File downloaded to:', downloadDest);

      // Show alert with options to open the file
      Alert.alert(
        'Download complete',
        `${item.surah_name} has been downloaded successfully!`,
        [
          {
            text: 'Open',
            onPress: () => {
              FileViewer.open(downloadDest)
                .then(() => console.log('File opened successfully'))
                .catch(error => {
                  console.log('Error opening file:', error);
                  Alert.alert(
                    'Error',
                    'Could not open the downloaded audio file.',
                  );
                });
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    } catch (error) {
      setDownloading(false);
      Alert.alert(
        'Download failed',
        'An error occurred while downloading the file.',
      );
      console.log('Download error:', error);
    }
  };
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('MediaPlayer', {
          item,
          name,
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
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <ImageBackground
          source={require('../../src/assets/image4.png')}
          resizeMode="cover"
          style={{ justifyContent: 'center', alignItems: 'center', padding: 10, tintColor: 'white', width: 40, height: 40 }}
        >

          <Text style={{ color: 'black', borderRadius: 5, fontSize: index < 99 ? 14 : 10 }}>
            {index + 1}
          </Text>
        </ImageBackground>
        <Text style={{ color: 'black', fontSize: 18, alignSelf: 'center' }}>{item.surah_name}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity onPress={downloadAudio}>
          {downloading ? (
            <ActivityIndicator color={'black'} size={25} />
          ) : (
            <Icon name="download" color="black" size={25} />
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
