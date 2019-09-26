import { StyleSheet } from 'react-native';

import colors from '../../helpers/colors';

export default StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 40,
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackImage: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  trackTimeContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackProgress: {
    width: '100%',
  },
  trackInfo: {
    width: '100%',
    alignItems: 'flex-start',
    marginVertical: 20,
  },
  trackName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
  },
  trackArtist: {
    fontSize: 14,
  },
  trackImageBackground: {
    position: 'absolute',
    width: 500,
    height: 500,
  },
});
