import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
  AppState,
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
import Slider from '@react-native-community/slider';

export default function MediaPlayer({route}) {
  const {item} = route.params;
  // console.log({item});

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const savePlayBackPosition = async () => {
    // Remove the previous playback position
    const previousSurahId = await AsyncStorage.getItem('surahId');
    if (previousSurahId && previousSurahId !== item.surah_id.toString()) {
      await AsyncStorage.removeItem(`playbackPosition_${previousSurahId}`);
    }
    const position = await TrackPlayer.getPosition();
    const surahId = item.surah_id;
    await AsyncStorage.setItem(
      `playbackPosition_${surahId}`,
      position.toString(),
    );
    await AsyncStorage.setItem('surahName', item.surah_name);
    await AsyncStorage.setItem('surahId', item.surah_id.toString());
    await AsyncStorage.setItem('surahUrl', item.url);
    console.log('Position saved:', position);
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

  useEffect(() => {
    setupPlayer();
    const interval = setInterval(async () => {
      const currentPosition = await TrackPlayer.getPosition();
      const trackDuration = await TrackPlayer.getDuration();
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
      // TrackPlayer.reset();
    };
  }, []);

  // useEffect(() => {
  //   // Stop the currently playing track if a new one is selected
  //   return () => {
  //     savePlayBackPosition();
  //     TrackPlayer.stop();  // Stop the previous track when a new one starts
  //   };
  // }, [item.surah_id]);

  const handleSeek = async value => {
    await TrackPlayer.seekTo(value);
    setPosition(value);
  };

  const setupPlayer = async () => {
    try {
      const isServiceRunning = await TrackPlayer.isServiceRunning();

      // Setup player only if the service is not already running
      if (!isServiceRunning) {
        await TrackPlayer.setupPlayer();
        console.log('TrackPlayer setup completed');
      } else {
        console.log('TrackPlayer service is already running');
      }

      const currentTrack = await TrackPlayer.getCurrentTrack();
      // Stop the current track if a new track is being added
      if (currentTrack !== null && currentTrack !== item.surah_id) {
        await TrackPlayer.reset();
      }

      await TrackPlayer.add({
        id: item.surah_id,
        url: item.url,
        title: item.surah_name,
        artist: 'Unknown Artist',
        artwork: require('../assets/new2.jpg'),
      });
      // const surahId = await AsyncStorage.getItem('surahId');
      console.log('surahId', item.surah_id);
      const savedPosition = await AsyncStorage.getItem(
        `playbackPosition_${item.surah_id}`,
      );
      if (savedPosition) {
        await TrackPlayer.seekTo(Number(savedPosition));
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

      console.log('TrackPlayer options updated');
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  };

  const togglePlayback = async () => {
    try {
      // Check if URL exists
      if (!item.url) {
        Alert.alert('Playback Error', 'No URL found for this track.');
        return;
      }
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack == null) {
        // Reinitialize the track if it's not loaded
        await setupPlayer();
        const savedPosition = await AsyncStorage.getItem('playbackPosition');

        if (savedPosition) {
          await TrackPlayer.seekTo(Number(savedPosition));
        }

        await TrackPlayer.play();
        setIsPlaying(true);
      } else {
        const playbackState = await TrackPlayer.getState();

        if (playbackState === State.Playing) {
          await TrackPlayer.pause();
          // savePlayBackPosition();
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

  const stopPlayback = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
      await TrackPlayer.seekTo(0);
      await TrackPlayer.stop(); // Stops the audio playback
      setIsPlaying(false); // Update the UI to reflect that playback is stopped
      console.log('Playback stopped');
    }
  };

  const handleRemotePlay = async () => {
    await TrackPlayer.play();
    setIsPlaying(true); // Set UI to show "Playing"
  };

  const handleRemotePause = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false); // Set UI to show "Paused"
  };

  const formatTime = seconds => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs > 0 ? hrs + ':' : ''}${
      hrs > 0 ? (mins < 10 ? '0' : '') : ''
    }${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  return (
    <>
      <CustomHeader text={item.surah_name} />
      <ImageBackground
        source={require('../assets/new1.jpg')}
        style={{flex: 1, padding: 20}}
        resizeMode="cover">
        <View style={{marginVertical: 20}}>
          <Slider
            style={{width: '100%'}}
            minimumValue={0}
            maximumValue={duration || 1}
            value={position}
            minimumTrackTintColor="rgba(187, 148, 87, 0.7)"
            maximumTrackTintColor="gray"
            thumbTintColor="black"
            onSlidingComplete={handleSeek}
          />
          {!item.url ? (
            <Icon name="ban" size={25} color="black" />
          ) : !position && !duration ? (
            <ActivityIndicator
              color={'black'}
              style={{marginHorizontal: 30}}
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
        </View>
        <TouchableOpacity onPress={togglePlayback} style={styles.row}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Icon name={isPlaying ? 'pause' : 'play'} color="black" size={20} />
            <Text style={styles.text}>{isPlaying ? 'Pause' : 'Play'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={stopPlayback} style={styles.row}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <Icon name="stop" color="black" size={20} />
            <Text style={styles.text}>Stop </Text>
          </View>
        </TouchableOpacity>
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
});
