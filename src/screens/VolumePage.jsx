import React, { useState } from 'react';
import { ImageBackground, TouchableOpacity, StyleSheet, Text, FlatList, Alert, Platform, ActivityIndicator, ToastAndroid, PermissionsAndroid, View } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CustomHeader from '../components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
const AudioPlayer = ({ route }) => {
  const { id, volumeData } = route.params;

  return (
    <>
      <CustomHeader text={'Volume ' + id} />
      <ImageBackground
        source={require('../assets/quran.jpg')}
        style={{ flex: 1, paddingHorizontal: 20 }}
        resizeMode="cover">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={volumeData}
          renderItem={({ item, index }) => (
            <VolumeDetails key={index} item={item} index={index} id={id} />
          )}
        />
      </ImageBackground>
    </>
  );
};

const VolumeDetails = ({ item, index }) => {
  const navigation = useNavigation();
  const [downloading, setDownloading] = useState(false);


  const showToast = () => {
    ToastAndroid.showWithGravity(
      'Your Download has Started',
      ToastAndroid.LONG,
      ToastAndroid.TOP,
    );
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // For Android 13+ (API level 33), request only audio media permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else if (Platform.Version >= 30) {
          // For Android 11 and 12 (API level 30 and 31), scoped storage is used by default
          // You may not need READ/WRITE_EXTERNAL_STORAGE, but can request if needed
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // For Android 10 and below, request both READ and WRITE permissions
          const writeGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
          );
          const readGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          return writeGranted === PermissionsAndroid.RESULTS.GRANTED &&
            readGranted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const downloadAudio = async () => {
    try {
      // Request storage permission
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "Storage permission is required to download audio files.");
        return;
      }

      setDownloading(true);
      const audioUrl = item.url;
      audioUrl && showToast();
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

  // const downloadAudio = async () => {
  //   setDownloading(true);

  //   const audioUrl = item.url;
  //   const downloadDest = `${RNFS.DownloadDirectoryPath}/${item.surah_name}.mp3`;

  //   RNFS.downloadFile({
  //     fromUrl: audioUrl,
  //     toFile: downloadDest,
  //   })
  //     .promise.then(async res => {
  //       setDownloading(false);
  //       // Show alert with options to open the file
  //       Alert.alert(
  //         'Download complete',
  //         `${item.surah_name} has been downloaded successfully!`,
  //         [
  //           {
  //             text: 'Open',
  //             onPress: () => {
  //               FileViewer.open(downloadDest)
  //                 .then(() => console.log('File opened successfully'))
  //                 .catch(error => {
  //                   console.log('Error opening file:', error);
  //                   Alert.alert(
  //                     'Error',
  //                     'Could not open the downloaded audio file.',
  //                   );
  //                 });
  //             },
  //           },
  //           {text: 'Cancel', style: 'cancel'},
  //         ],
  //       );
  //     })
  //     .catch(err => {
  //       setDownloading(false);
  //       Alert.alert(
  //         'Download failed',
  //         'An error occurred while downloading the file.',
  //       );
  //       console.log('Download error:', err);
  //     });
  // };
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('MediaPlayer', { item })}>
      <View style={{ flexDirection: 'row' }}>
        <ImageBackground
          source={require('../../src/assets/image4.png')}
          resizeMode="cover"
          style={{ justifyContent: 'center', alignItems: 'center', padding: 10, tintColor: 'white', width: 40, height: 40 }}
        >

          <Text style={{ color: 'black', borderRadius: 5, fontSize: 12 }}>
            {index + 1}
          </Text>
        </ImageBackground>
        <Text style={styles.text}> {item.surah_name}</Text>
      </View>
      <TouchableOpacity onPress={downloadAudio}>
        {downloading ? (
          <ActivityIndicator color={'black'} size={25} />
        ) : (
          <Icon name="download" color="black" size={25} />
        )}
      </TouchableOpacity>
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
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  text: {
    color: 'black',
    fontSize: 18,
    alignSelf: 'center'
  },
});
