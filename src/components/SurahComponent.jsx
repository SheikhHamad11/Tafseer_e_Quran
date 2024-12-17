import {useNavigation} from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import DownloadCompleteModal from './DownloadModal';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useState} from 'react';
export const SurahComponent = ({item, index}) => {
  const [downloading, setDownloading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [downloadDestPath, setDownloadDestPath] = useState(null);
  const navigation = useNavigation();
  const name = item.surah_name;

  const showToast = () => {
    ToastAndroid.showWithGravity(
      'Your Download has Started',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // For Android 13+ (API level 33), request only audio media permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else if (Platform.Version >= 30) {
          // For Android 11 and 12 (API level 30 and 31), scoped storage is used by default
          // You may not need READ/WRITE_EXTERNAL_STORAGE, but can request if needed
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // For Android 10 and below, request both READ and WRITE permissions
          const writeGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          const readGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
          return (
            writeGranted === PermissionsAndroid.RESULTS.GRANTED &&
            readGranted === PermissionsAndroid.RESULTS.GRANTED
          );
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
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to download audio files.',
        );
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
      setDownloadDestPath(downloadDest);
      // Show the modal after download completes successfully
      setModalVisible(true);
    } catch (error) {
      setDownloading(false);
      Alert.alert(
        'Download failed',
        'An error occurred while downloading the file.',
      );
      console.log('Download error:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <>
      <DownloadCompleteModal
        visible={isModalVisible}
        onClose={closeModal}
        surahName={item.surah_name}
        downloadDest={downloadDestPath}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MediaPlayer', {
            item,
            name,
          })
        }
        style={{
          backgroundColor: 'rgba(187, 148, 87, 0.8)',
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
          marginVertical: 10,
        }}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <ImageBackground
            source={require('../../src/assets/image4.png')}
            resizeMode="cover"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              tintColor: 'white',
              width: 40,
              height: 40,
            }}>
            <Text
              style={{
                color: 'black',
                borderRadius: 5,
                fontSize: index < 99 ? 14 : 10,
              }}>
              {index + 1}
            </Text>
          </ImageBackground>
          <Text style={{color: 'black', fontSize: 18, alignSelf: 'center'}}>
            {item.surah_name}
          </Text>
        </View>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity onPress={downloadAudio}>
            {downloading ? (
              <ActivityIndicator color={'black'} size={25} />
            ) : (
              <Icon name="download" color="black" size={25} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </>
  );
};
