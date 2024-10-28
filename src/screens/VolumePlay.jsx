import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  AppState,
  Alert,
} from 'react-native';
import TrackPlayer, {
  Capability,
  Event,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

export default function VolumePlay({route}) {
  const {item} = route.params;
  // console.log({item});
  const playbackState = usePlaybackState();
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useNavigation();
  // useFocusEffect(
  //   useCallback(() => {
  //     return () => savePlaybackPosition(); // Save position when navigating away
  //   }, []),
  // );

  // const handleAppStateChange = async nextAppState => {
  //   if (nextAppState === 'background') {
  //     await savePlaybackPosition();
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {
      const savePosition = async () => {
        const position = await TrackPlayer.getPosition();
        await AsyncStorage.setItem('playbackPosition', position.toString());
        await AsyncStorage.setItem('surahName', item.surah_name);
        await AsyncStorage.setItem('surahId', item.surah_id.toString());
        await AsyncStorage.setItem('surahUrl', item.url);
        console.log('Position saved:', position);
      };

      const onBlur = () => {
        savePosition();
      };

      navigation.addListener('blur', onBlur);

      return () => {
        navigation.removeListener('blur', onBlur);
      };
    }, [item]),
  );

  useEffect(() => {
    setupPlayer();
    // AppState.addEventListener('change', handleAppStateChange);
    // Event listeners for remote control events
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
      TrackPlayer.reset();
    };
  }, []);

  const setupPlayer = async () => {
    try {
      const isServiceRunning = await TrackPlayer.isServiceRunning();

      if (!isServiceRunning) {
        await TrackPlayer.setupPlayer();
        console.log('TrackPlayer setup completed');
      } else {
        console.log('TrackPlayer service is already running');
      }

      await TrackPlayer.add({
        id: item.surah_id,
        url: item.url,
        title: item.surah_name,
        artist: 'Unknown Artist',
        artwork: require('../assets/quran.jpg'),
      });

      const savedPosition = await AsyncStorage.getItem('playbackPosition');
      if (savedPosition) {
        await TrackPlayer.seekTo(Number(savedPosition));
      }

      await TrackPlayer.updateOptions({
        stopWithApp: false,
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
      });

      console.log('TrackPlayer options updated');
    } catch (error) {
      console.error('Error setting up TrackPlayer:', error);
    }
  };

  const togglePlayback = async () => {
    try {
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

  return (
    <>
      <CustomHeader text={item.surah_name} />
      <ImageBackground
        source={require('../assets/quran.jpg')}
        style={{flex: 1, padding: 20}}
        resizeMode="cover">
        <TouchableOpacity onPress={togglePlayback} style={styles.row}>
          <Icon name={isPlaying ? 'pause' : 'play'} color="black" size={20} />
          <Text style={styles.text}>{isPlaying ? 'Pause' : 'Play'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={stopPlayback} style={styles.row}>
          <Icon name="stop" color="black" size={20} />
          <Text style={styles.text}>Stop </Text>
        </TouchableOpacity>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'rgba(149, 129, 89, 0.9)',
    padding: 10,
    flexDirection: 'row',
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

// import {
//   Text,
//   ImageBackground,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import TrackPlayer, {
//   Capability,
//   Event,
//   State,
//   usePlaybackState,
// } from 'react-native-track-player';
// import React, {useEffect, useState} from 'react';
// import CustomHeader from '../components/CustomHeader';
// import Icon from 'react-native-vector-icons/FontAwesome6';
// import {Volume} from '../components/VolumeList';
// export default function VolumePlay({route}) {
//   const {item} = route.params;
//   // console.log('sleeted', item);
//   const playbackState = usePlaybackState();
//   const [isPlaying, setIsPlaying] = useState(false);
//   useEffect(() => {
//     setupPlayer();

//        // Event listeners for remote control events
//        const remotePlayListener = TrackPlayer.addEventListener(
//         Event.RemotePlay,
//         handleRemotePlay,
//       );
//       const remotePauseListener = TrackPlayer.addEventListener(
//         Event.RemotePause,
//         handleRemotePause,
//       );

//       // Cleanup on unmount
//       return () => {
//         remotePlayListener.remove();
//         remotePauseListener.remove();
//         TrackPlayer.reset();
//       };

//       // Clean up listener on unmount
//       return () => {
//         listener.remove();
//       };
//     return () => {
//       TrackPlayer.reset();
//     };
//   }, []);

//   const setupPlayer = async () => {
//     try {
//       const isServiceRunning = await TrackPlayer.isServiceRunning();

//       if (!isServiceRunning) {
//         // Initialize the player only if it's not running
//         await TrackPlayer.setupPlayer();
//         console.log('TrackPlayer setup completed');
//       } else {
//         console.log('TrackPlayer service is already running');
//       }

//       await TrackPlayer.add({
//         id: item.surah_id,
//         url: item.url, // Your audio file URL
//         title: item.surah_name,
//         artist: 'Unknown Artist',
//         artwork: require('../assets/quran.jpg'), // Artwork image URL});
//       });

//       // {
//       //   id: 1,
//       //   url: 'http://download.quranurdu.com/Al%20Quran%20with%20Urdu%20Translation%20by%20Abdul%20Rahman%20Al-Sudais/001%20Al%20Fatihah/1%20Al%20Fatiha-quranurdu.com.mp3', // Your audio file URL
//       //   title: 'baqrah',
//       //   artist: 'Unknown Artist',
//       //   artwork: require('../assets/quran.jpg'), // Artwork image URL});
//       // }
//       await TrackPlayer.updateOptions({
//         stopWithApp: false,
//         capabilities: [
//           Capability.Play,
//           Capability.Pause,
//           Capability.Stop,
//           Capability.SeekTo,
//           // Capability.SkipToNext,
//           // Capability.SkipToPrevious,
//         ],
//         compactCapabilities: [
//           Capability.Play,
//           Capability.Pause,
//           Capability.Stop,
//           Capability.SeekTo,
//           // Capability.SkipToNext,
//           // Capability.SkipToPrevious,
//         ],
//       });

//       console.log('TrackPlayer options updated');
//     } catch (error) {
//       console.error('Error setting up TrackPlayer:', error);
//     }
//   };
//   const handleRemotePlay = async () => {
//     await TrackPlayer.play();
//     setIsPlaying(true); // Set UI to show "Playing"
//   };

//   const handleRemotePause = async () => {
//     await TrackPlayer.pause();
//     setIsPlaying(false); // Set UI to show "Paused"
//   };

//   const togglePlayback = async () => {
//     const currentTrack = await TrackPlayer.getCurrentTrack();
//     if (currentTrack != null) {
//       const playbackState = await TrackPlayer.getState();
//       console.log('Playback State:', playbackState); // Debugging log to check current state
//       if (playbackState === State.Playing) {
//         await TrackPlayer.pause();
//         setIsPlaying(false);
//       } else {
//         await TrackPlayer.play();
//         setIsPlaying(true);
//       }
//     }
//   };

//   // Function to go to the next track
//   const skipToNext = async () => {
//     await TrackPlayer.skipToNext();
//     console.log('Skipped to next track');
//   };

//   // Function to go to the previous track
//   const skipToPrevious = async () => {
//     await TrackPlayer.skipToPrevious();
//     console.log('Skipped to previous track');
//   };

//   const stopPlayback = async () => {
//     const currentTrack = await TrackPlayer.getCurrentTrack();
//     if (currentTrack != null) {
//       await TrackPlayer.seekTo(0);
//       await TrackPlayer.stop(); // Stops the audio playback
//       setIsPlaying(false); // Update the UI to reflect that playback is stopped
//       console.log('Playback stopped');
//     }
//   };

//   useEffect(() => {
//     setupPlayer();

//     // Event listeners for remote control events
//     const remotePlayListener = TrackPlayer.addEventListener(
//       Event.RemotePlay,
//       handleRemotePlay,
//     );
//     const remotePauseListener = TrackPlayer.addEventListener(
//       Event.RemotePause,
//       handleRemotePause,
//     );

//     // Cleanup on unmount
//     return () => {
//       remotePlayListener.remove();
//       remotePauseListener.remove();
//       TrackPlayer.reset();
//     };

//     // Clean up listener on unmount
//     return () => {
//       listener.remove();
//     };
//   }, []);
//   return (
//     <>
//       <CustomHeader text={item.surah_name} />
//       <ImageBackground
//         source={require('../assets/quran.jpg')}
//         style={{flex: 1, padding: 20}}
//         resizeMode="cover">
//         <TouchableOpacity onPress={togglePlayback} style={styles.row}>
//           <Icon name={isPlaying ? 'pause' : 'play'} color="black" size={20} />
//           <Text style={styles.text}>{isPlaying ? 'Pause' : 'Play'}</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={stopPlayback} style={styles.row}>
//           <Icon name="stop" color="black" size={20} />
//           <Text style={styles.text}>Stop </Text>
//         </TouchableOpacity>
//         {/*
//         <Button onPress={skipToPrevious} title="Previous" />
//         <Button onPress={skipToNext} title="Next" /> */}
//       </ImageBackground>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   row: {
//     backgroundColor: 'rgba(149, 129, 89, 0.9)',
//     padding: 10,
//     flexDirection: 'row',
//     // justifyContent: 'space-between',
//     gap: 10,
//     alignItems: 'center',
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   text: {
//     color: 'black',
//     fontSize: 18,
//   },
// });

// const tracks = selectedSurah
//   .map((surah, index) => ({
//     id: surah.surah_id.toString(), // Ensure ID is a string
//     url: surah.url, // The audio URL from your API
//     title: surah.surah_name || `Track ${index + 1}`, // Use a title from the API or default
//     artist: 'Unknown Artist', // Set artist as needed
//     artwork: require('../assets/quran.jpg'), // Use artwork from API or fallback image
//   }))
//   .flat();
// console.log(tracks);

// const tracks = [url];
// Now that the player is confirmed to be running, add the track and update options
