import React, {
  useEffect, useState, useCallback,
} from 'react';
import {
  View, Text, TouchableOpacity, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';

import formatTime from '../../helpers/formatTime';
import AudioPlayer from '../../helpers/nativePlayer';
import tracks from '../../helpers/tracks';
import colors from '../../helpers/colors';

function Player() {
  const [trackStatus, setTrackStatus] = useState('stopped');
  const [trackDuration, setTrackDuration] = useState(0);
  const [tracksList] = useState(tracks);
  const [trackProgress, setTrackProgress] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(tracksList[0]);

  useEffect(() => {
    AudioPlayer.initialize(currentTrack.url)
      .then((trackInfo) => {
        setTrackDuration(trackInfo.duration);
      });
  }, [currentTrack]);

  useEffect(() => {
    return AudioPlayer.onTrackProgressChange((progress) => {
      setTrackProgress(progress);
    });
  });

  useEffect(() => {
    return AudioPlayer.onTrackEnd(() => {
      setTrackStatus('stopped');
      const currentTrackIndex = tracksList.findIndex(track => track.id === currentTrack.id);
      const nextTrackIndex = currentTrackIndex + 1;
      if (nextTrackIndex < tracksList.length) {
        setCurrentTrack(tracksList[nextTrackIndex]);
      }
    });
  });

  const onPlay = useCallback(() => {
    AudioPlayer.play();
    setTrackStatus('playing');
  }, []);

  const onPause = useCallback(() => {
    AudioPlayer.pause();
    setTrackStatus('paused');
  }, []);

  const onSeekToTime = useCallback((time) => {
    AudioPlayer.seekToTime(time);
  }, []);

  return (
    <View style={styles.screen}>
      <Image
        source={{ uri: currentTrack.image }}
        style={styles.trackImage}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName}>{currentTrack.name}</Text>
        <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
      </View>
      <Slider
        style={styles.trackProgress}
        minimumValue={0}
        maximumValue={trackDuration}
        minimumTrackTintColor={colors.controls}
        maximumTrackTintColor={colors.gray}
        thumbTintColor={colors.controls}
        value={trackProgress}
        step={1}
      />
      <View style={styles.trackTimeContainer}>
        <Text>{formatTime(trackProgress)}</Text>
        <Text>{formatTime(trackDuration)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSeekToTime(trackProgress - 10)}
        >
          <Icon name="replay-10" size={35} color={colors.controls} />
        </TouchableOpacity>
        <Icon name="skip-previous" size={35} color={colors.controls} />
        {trackStatus === 'playing'
          ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPause}
            >
              <Icon name="pause-circle-filled" size={70} color={colors.controls} />
            </TouchableOpacity>
          )
          : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onPlay}
            >
              <Icon name="play-circle-filled" size={70} color={colors.controls} />
            </TouchableOpacity>
          )
        }
        <Icon name="skip-next" size={35} color={colors.controls} />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onSeekToTime(trackProgress + 10)}
        >
          <Icon name="forward-10" size={35} color={colors.controls} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Player;
