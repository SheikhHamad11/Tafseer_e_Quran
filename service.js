// service.js
import TrackPlayer from 'react-native-track-player';
const trackIds = ['1', '2'];
module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.reset();
  });
  TrackPlayer.addEventListener('remote-seek', async event => {
    // Seek to the position specified in the event (in seconds)
    await TrackPlayer.seekTo(event.position);
    console.log(`Seeked to position: ${event.position}`);
  });
  TrackPlayer.addEventListener('remote-next', async () => {
    // await handleNextTrack();
    await TrackPlayer.skipToNext();
  });

  // Event listener for remote previous
  TrackPlayer.addEventListener('remote-previous', async () => {
    // await handlePreviousTrack();
    await TrackPlayer.skipToPrevious();
  });
};
