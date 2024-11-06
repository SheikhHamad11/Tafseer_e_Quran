// service.js
import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-stop', () => {

    TrackPlayer.seekTo(0)
    TrackPlayer.stop();
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

  // Jump forward by 10 seconds
  TrackPlayer.addEventListener('remote-jump-forward', async event => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPosition + (event.interval || 10));
    console.log(`Jumped forward by ${event.interval || 10} seconds`);
  });

  // Jump backward by 10 seconds
  TrackPlayer.addEventListener('remote-jump-backward', async event => {
    const currentPosition = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(currentPosition - (event.interval || 10));
    console.log(`Jumped backward by ${event.interval || 10} seconds`);
  });


};


