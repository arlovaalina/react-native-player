import { NativeModules, NativeEventEmitter } from 'react-native';

const NativePlayer = NativeModules.Player;

const nativeEvents = new NativeEventEmitter(NativePlayer);

const initialize = url => new Promise((resolve) => {
  NativePlayer.initialize(url, (trackInfo) => {
    resolve(trackInfo);
  });
});

const play = () => {
  NativePlayer.play();
};

const pause = () => {
  NativePlayer.pause();
};

const seekToTime = (miliseconds) => {
  const milisecondsString = miliseconds.toString();
  NativePlayer.seekToTime(milisecondsString);
};

const onTrackProgressChange = (callback) => {
  const listenerCallback = ({ progress }) => callback(progress);
  nativeEvents.addListener('onTrackProgressChange', listenerCallback);
  return () => nativeEvents.removeListener('onTrackProgressChange', listenerCallback);
};

const onTrackEnd = (callback) => {
  nativeEvents.addListener('onTrackEnd', callback);
  return () => nativeEvents.removeListener('onTrackEnd', callback);
};

export default {
  initialize,
  play,
  pause,
  seekToTime,
  onTrackProgressChange,
  onTrackEnd,
};
