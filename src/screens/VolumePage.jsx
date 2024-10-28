import React, {useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import Icon from 'react-native-vector-icons/FontAwesome6';
import CustomHeader from '../components/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import RNFS from 'react-native-fs';
const AudioPlayer = ({route}) => {
  const {id, volumeData} = route.params;

  return (
    <>
      <CustomHeader text={'Volume ' + id} />
      <ImageBackground
        source={require('../assets/quran.jpg')}
        style={{flex: 1, paddingHorizontal: 20}}
        resizeMode="cover">
        <FlatList
          showsVerticalScrollIndicator={false}
          data={volumeData}
          renderItem={({item, index}) => (
            <VolumeDetails key={index} item={item} index={index} id={id} />
          )}
        />
      </ImageBackground>
    </>
  );
};

const VolumeDetails = ({item, index}) => {
  const navigation = useNavigation();
  const [downloading, setDownloading] = useState(false);

  // Download audio function
  // const downloadAudio = async => {
  //   setDownloading(true);

  //   const audioUrl = item.url;
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

  const downloadAudio = async () => {
    setDownloading(true);

    const audioUrl = item.url;
    const downloadDest = `${RNFS.DownloadDirectoryPath}/${item.surah_name}.mp3`;

    RNFS.downloadFile({
      fromUrl: audioUrl,
      toFile: downloadDest,
    })
      .promise.then(async res => {
        setDownloading(false);
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
            {text: 'Cancel', style: 'cancel'},
          ],
        );
        // Alert.alert(
        //   'Download complete',
        //   `${item.surah_name} has been downloaded successfully!`,
        // );
        // console.log('File downloaded to:', downloadDest);

        // Share the downloaded audio file
        // const options = {
        //   url: `file://${downloadDest}`,
        //   type: 'audio/mp3',
        // };
        // try {
        //   await FileViewer.open(options.url); // Opens the file with available apps
        // } catch (error) {
        //   console.log('Error sharing file:', error);
        //   Alert.alert('Error', 'Could not open the downloaded audio file.');
        // }
      })
      .catch(err => {
        setDownloading(false);
        Alert.alert(
          'Download failed',
          'An error occurred while downloading the file.',
        );
        console.log('Download error:', err);
      });
  };
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => navigation.navigate('VolumePlay', {item})}>
      <Text style={styles.text}>
        {index + 1}. {item.surah_name}
      </Text>
      <TouchableOpacity onPress={downloadAudio}>
        {downloading ? (
          <Icon name="spinner" color="black" size={25} />
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
  },
});
