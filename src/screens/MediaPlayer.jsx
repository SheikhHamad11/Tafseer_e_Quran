import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert, View,
  ActivityIndicator,
  AppState, ToastAndroid, Platform, PermissionsAndroid,
  Linking,
} from 'react-native';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  State,
} from 'react-native-track-player';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { QuranContext } from '../hook/contextApi';
import { Urdu_data } from '../components/UrduTranslation';
import DownloadCompleteModal from '../components/DownloadModal';
import RNFS from 'react-native-fs';
export default function MediaPlayer({ route }) {
  const { item } = route.params;
  const { lastSurahDataState } = useContext(QuranContext);
  const [lastSurahData, setlastSurahData] = lastSurahDataState;
  const [downloading, setDownloading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [downloadDestPath, setDownloadDestPath] = useState(null);
  let {
    Position,
    lastIndex,
    catId,
    surahId
  } = lastSurahData;
  const [trackTitle, setTrackTitle] = useState('playing...');
  const cat_id = item?.cat_id ? item.cat_id : catId;
  const surah_id = item?.surah_id ? item.surah_id : surahId;

  const [currentSurahIndex, setCurrentSurahIndex] = useState(item?.cat_id ? 0 : lastIndex);
  const selectedItem = Urdu_data.find(item => item.cat_id === cat_id).surah_data.find(item => item.surah_id === surah_id)
  const selectedUrls = selectedItem.url;
  const surahUrls = Array.isArray(selectedUrls) ? selectedUrls : [selectedUrls]; // Get URL based on index
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queueLength, setQueueLength] = useState(0);

  const surahForPlay = surahUrls[currentSurahIndex]



  const savePlayBackPosition = async () => {
    // Remove the previous playback position
    const previousSurahId = await AsyncStorage.getItem('surahId');
    if (previousSurahId && previousSurahId !== selectedItem.surah_id.toString()) {
      await AsyncStorage.removeItem(`playbackPosition_${previousSurahId}`);
    }
    const position = await TrackPlayer.getPosition();
    const currentUrl = await TrackPlayer.getActiveTrack();
    const title = currentUrl.title
    const match = title?.match(/Rukoo (\d+)/);
    const lastIndex = match ? parseInt(match[1], 10) : null;
    let saveObject = JSON.stringify({
      Position: position,
      lastIndex: parseInt(lastIndex) - 1,
      catId: item?.cat_id || catId,
      surahId: selectedItem?.surah_id,
      surahName: selectedItem?.surah_name
    })
    await AsyncStorage.setItem('surahData',
      saveObject);
  };
  useEffect(() => {
    // AppState listener to detect app state changes
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'background') {
        // Save playback position when the app goes to the background
        savePlayBackPosition();
      } else if (nextAppState === 'inactive') {
        // Stop playback when app is closed from recent apps
        TrackPlayer.stop();
      }
    };

    // Listen to app state changes
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      // Unsubscribe from app state changes
      subscription.remove();
      savePlayBackPosition();
    };
  }, [item]);

  const isSameSurah = async () => {
    const isServiceRunning = await TrackPlayer.isServiceRunning();

    const activeTrack = await TrackPlayer.getActiveTrack();
    const match = activeTrack?.id?.match(/^(\d+)_/);
    const beforeUnderscoreIdIs = match ? match[1] : null;

    if (isServiceRunning && selectedItem.surah_id == beforeUnderscoreIdIs) {
      return true
    } else return false
  }

  useEffect(() => {
    setupPlayer();
    // Setup player only if it's a different Surah
    const interval = setInterval(async () => {
      const trackDuration = await TrackPlayer.getDuration();
      const currentPosition = await TrackPlayer.getPosition();
      setPosition(currentPosition);
      setDuration(trackDuration);
      // Update notification with position and duration
    }, 1000);

    const remotePlayListener = TrackPlayer.addEventListener(
      Event.RemotePlay,
      handleRemotePlay,
    );
    const remotePauseListener = TrackPlayer.addEventListener(
      Event.RemotePause,
      handleRemotePause,
    );

    const stopListener = TrackPlayer.addEventListener(Event.RemoteStop, () => {
      setIsPlaying(false);
    });

    // Cleanup on unmount
    return () => {
      remotePlayListener.remove();
      remotePauseListener.remove();
      stopListener.remove();
      clearInterval(interval);
      savePlayBackPosition();
    };
  }, []); // Add selectedItem.surah_id as a dependency


  const handleSeek = async value => {
    await TrackPlayer.seekTo(value);
    setPosition(value);
  };

  const setupPlayer = async () => {
    try {
      const isServiceRunning = await TrackPlayer.isServiceRunning();
      if (!isServiceRunning) {
        await TrackPlayer.setupPlayer();
        console.log('TrackPlayer setup completed');
      } else {
        console.log('TrackPlayer service is already running');
      }
      const isSame = await isSameSurah(); // Await the result of the async function
      console.log({ isSame, isServiceRunning });
      if (item !== null) {
        if (isSame) {
          setIsPlaying(true)
          const activeTrack = await TrackPlayer.getActiveTrack();
          const title = activeTrack?.title || 'No Title';
          const match = title?.match(/Rukoo (\d+)/);
          const lastIndex = match ? parseInt(match[1], 10) : null;
          await setTrackTitle(title)
          await setCurrentSurahIndex(lastIndex - 1);
          return
        }
        else await TrackPlayer.reset();
      }

      // Add new track since it's different or there's no current track
      await TrackPlayer.add({
        id: `${selectedItem.surah_id}_${currentSurahIndex}`, // Unique ID for each part
        url: surahForPlay,
        title: `${selectedItem.surah_name} - Rukoo ${currentSurahIndex + 1}`,
        artist: 'Tafheem-ul-Quran',
        artwork: require('../assets/new2.jpg'),
      });
      await setTrackTitle(`${selectedItem.surah_name} - Rukoo ${currentSurahIndex + 1}`)
      if (Position && !item?.cat_id) {
        console.log(`Seeking to position: ${Position}`);
        await TrackPlayer.seekTo(Number(Position));
      }

      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.SeekTo,
        ],
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
      });

    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  };




  const togglePlayback = async () => {
    try {
      // Check if URL exists
      if (!selectedItem.url) {
        Alert.alert('Playback Error', 'No URL found for this track.');
        return;
      }
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack == null) {
        // Reinitialize the track if it's not loaded
        await setupPlayer();
        if (Position) {
          await TrackPlayer.seekTo(Number(Position));
        }

        await TrackPlayer.play();
        setIsPlaying(true);
      } else {
        const playbackState = await TrackPlayer.getState();

        if (playbackState === State.Playing) {
          await TrackPlayer.pause();
          setIsPlaying(false);
        } else {
          await TrackPlayer.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      // Show alert if track is not found or there’s an error playing the track
      Alert.alert(
        'Playback Error',
        'Track link not found. Please try again later.',
      );
      console.error('Playback error:', error);
    }
  };

  useEffect(() => {
    const trackEndListener = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      async () => {
        console.log('PlaybackQueueEnded')
        await playNextTrack()
      }
    );

    return () => {
      trackEndListener.remove();
    };
  }, []);




  const handleRemotePlay = async () => {
    await TrackPlayer.play();
    setIsPlaying(true); // Set UI to show "Playing"
  };

  const handleRemotePause = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false); // Set UI to show "Paused"
  };

  const stopPlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
      await TrackPlayer.seekTo(0);
      await TrackPlayer.stop(); // Stops the audio playback
      setIsPlaying(false); // Update the UI to reflect that playback is stopped
      console.log('Playback stopped');
    }
  };

  const playNextTrack = async () => {
    try {
      // Ensure we don't go beyond the available tracks
      setCurrentSurahIndex((prevIndex) => {
        if (prevIndex < surahUrls.length - 1) {
          const nextIndex = prevIndex + 1;
          const nextSurahUrl = surahUrls[nextIndex];
          console.log({ nextIndex, nextSurahUrl, surahForPlay, currentSurahIndex: prevIndex });

          TrackPlayer.reset().then(() => {
            TrackPlayer.add({
              id: `${selectedItem.surah_id}_${nextIndex}`,
              url: nextSurahUrl,
              title: `${selectedItem.surah_name} - Rukoo ${nextIndex + 1}`,
              artist: 'Tafheem-ul-Quran',
              artwork: require('../assets/new2.jpg'),
            }).then(() => {
              setTrackTitle(`${selectedItem.surah_name} - Rukoo ${nextIndex + 1}`);
              TrackPlayer.play();
            });
          });

          setIsPlaying(true);
          return nextIndex;
        } else {
          console.log('No more tracks to play.');
          showToast1()
          return prevIndex;
        }
      });
    } catch (error) {
      console.error('Error playing next track:', error);
    }
  };


  // const playNextTrack = async () => {
  //   try {
  //     // Ensure we don't go beyond the available tracks
  //     if (currentSurahIndex < surahUrls.length - 1) {
  //       const nextIndex = currentSurahIndex + 1;
  //       setCurrentSurahIndex((pre) => pre + 1);
  //       const nextSurahUrl = surahUrls[nextIndex];
  //       console.log({ nextIndex, nextSurahUrl, surahForPlay, currentSurahIndex })
  //       await TrackPlayer.reset(); // Reset the player to avoid multiple tracks in the queue
  //       setIsPlaying(true)
  //       await TrackPlayer.add({
  //         id: `${selectedItem.surah_id}_${nextIndex}`,
  //         url: nextSurahUrl,
  //         title: `${selectedItem.surah_name} - Rukoo ${nextIndex + 1}`,
  //         artist: 'Tafheem-ul-Quran',
  //         artwork: require('../assets/new2.jpg'),
  //       });
  //       await setTrackTitle(`${selectedItem.surah_name} - Rukoo ${nextIndex + 1}`)

  //       await TrackPlayer.play(); // Start playing the next track
  //     } else {
  //       console.log('No more tracks to play.');
  //     }
  //   } catch (error) {
  //     console.error('Error playing next track:', error);
  //   }
  // };

  const playPreviousTrack = async () => {
    try {
      // Ensure we don't go below the first track
      if (currentSurahIndex > 0) {
        const prevIndex = currentSurahIndex - 1;
        setCurrentSurahIndex((pre) => pre - 1);
        setIsPlaying(true)
        const prevSurahUrl = surahUrls[prevIndex];
        await TrackPlayer.reset(); // Reset the player for the new track

        await TrackPlayer.add({
          id: `${selectedItem.surah_id}_${prevIndex}`,
          url: prevSurahUrl,
          title: `${selectedItem.surah_name} - Rukoo ${prevIndex + 1}`,
          artist: 'Tafheem-ul-Quran',
          artwork: require('../assets/new2.jpg'),
        });
        await setTrackTitle(`${selectedItem.surah_name} - Rukoo ${prevIndex + 1}`)

        await TrackPlayer.play(); // Start playing the previous track
      } else {
        console.log('No previous tracks to play.');
      }
    } catch (error) {
      console.error('Error playing previous track:', error);
    }
  };


  const showToast = () => {
    ToastAndroid.showWithGravity(
      'Your Download has Started',
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  };

  const showToast1 = () => {
    ToastAndroid.showWithGravity(
      'No More Tracks To Play',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  };





  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          return await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          ) === PermissionsAndroid.RESULTS.GRANTED;
        } else if (Platform.Version >= 30) {
          return await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ) === PermissionsAndroid.RESULTS.GRANTED;
        } else {

          return true;
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
      const audioUrl = surahForPlay;
      audioUrl && showToast();
      let downloadDest;
      if (Platform.OS === 'android') {
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

  // Extract the part you want
  const fileName = surahForPlay.split('/').pop(); // Get the last part of the URL
  const displayName = fileName.replace('.mp3', '');


  return (
    <>
      <DownloadCompleteModal
        visible={isModalVisible}
        onClose={closeModal}
        surahName={item?.surah_name}
        downloadDest={downloadDestPath}
      />
      <CustomHeader text={selectedItem.surah_name} />
      <ImageBackground
        source={require('../assets/new1.jpg')}
        style={{ flex: 1, padding: 20 }}
        resizeMode="cover">
        <View style={{ marginVertical: 20 }}>
          <Slider
            style={{ width: '100%' }}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            minimumTrackTintColor="rgba(187, 148, 87, 0.7)"
            maximumTrackTintColor="gray"
            thumbTintColor="black"
            onSlidingComplete={handleSeek}
          />
          {!selectedItem.url ? (
            <Icon name="ban" size={25} color="black" />
          ) : !position && !duration ? (
            <ActivityIndicator
              color={'black'}
              style={{ marginHorizontal: 30 }}
              size={25}
            />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.text}>{formatTime(position)}</Text>
              {/* <Text style={styles.text}>---</Text> */}
              <Text style={styles.text}>{formatTime(duration)}</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', alignSelf: 'center', gap: 10, marginTop: 10 }}>
            <TouchableOpacity onPress={downloadAudio} disabled={downloading}>
              {downloading ? (
                <ActivityIndicator color='black' size={25} />
              ) : (
                <Icon name="download" color="black" size={25} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ color: 'black', textAlign: 'center', fontSize: 16 }}>{trackTitle ? trackTitle : "Loading..."}</Text>

        <View style={styles.controlContainer}>
          <TouchableOpacity
            onPress={playPreviousTrack}
            disabled={currentSurahIndex <= 0}
          >
            <Icon name="backward" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayback}>
            <Icon1
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={60}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={playNextTrack}
          // disabled={currentSurahIndex >= surahUrls.length - 1}
          >
            <Icon name="forward" size={30} color="black" />
          </TouchableOpacity>

        </View>


        {/* 
        <TouchableOpacity onPress={stopPlayback} style={styles.row}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Icon name="stop" color="black" size={20} />
            <Text style={styles.text}>Stop </Text>
          </View>
        </TouchableOpacity> */}
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'rgba(187, 148, 87, 0.8)',
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
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});

const formatTime = seconds => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs > 0 ? hrs + ':' : ''}${hrs > 0 ? (mins < 10 ? '0' : '') : ''
    }${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

