import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contact: {
    backgroundColor: '#fff',
    padding: DevicePixels[10],
    borderBottomWidth: 1,
    borderColor: '#c9c9c9c9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: DevicePixels[50],
  },
  spinner: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
  title: {
    fontSize: DevicePixels[28],
  },
  row: {
    flexDirection: 'row',
    height: DevicePixels[60],
    borderTopWidth: 0.4,
    borderBottomWidth: 0.4,
    borderColor: colors.borderColor,
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: DevicePixels[25],
    color: colors.appBlue,
  },
  iconContainer: {
    width: DevicePixels[60],
    alignItems: 'center',
  },
  text: {
    fontSize: DevicePixels[16],
    flex: 1,
  },
  chevron: {
    paddingHorizontal: DevicePixels[20],
    fontSize: DevicePixels[25],
    color: colors.textGrey,
  },
});
