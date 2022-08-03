import React, {useRef, useState} from 'react';
import {Dimensions, Platform, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {getVideoHeight} from '../../helpers';
import DevicePixels from '../../helpers/DevicePixels';
import {logError} from '../../helpers/error';
import colors from '../../constants/colors';
import moment from 'moment';

const ExerciseVideo: React.FC<{
  path: string;
  paused?: boolean;
  onPause?: () => void;
  onPlay?: () => void;
}> = ({path, paused: startedPaused, onPause, onPlay}) => {
  const [paused, setPaused] = useState(startedPaused);
  const [hideTime, setHideTime] = useState(moment().unix());
  const ref = useRef<Video>();
  const showControls = paused || moment().unix() < hideTime + 3;
  return (
    <>
      {Platform.OS === 'ios' ? (
        <Video
          source={{uri: path}}
          ref={ref}
          onError={e => console.error(e)}
          style={{height: getVideoHeight()}}
          //repeat
          onEnd={() => {
            ref.current?.seek(0);
          }}
          paused={paused}
          onTouchStart={() => setHideTime(moment().unix())}
          disableFocus
        />
      ) : (
        <Video
          source={{uri: `file://${path}`}}
          style={{height: getVideoHeight()}}
          ref={ref}
          onError={e => console.error(e)}
          // repeat
          onEnd={() => {
            ref.current?.seek(0);
          }}
          paused={paused}
          onTouchStart={() => setHideTime(moment().unix())}
          disableFocus
        />
      )}

      {showControls && (
        <TouchableOpacity
          onPress={() => {
            setHideTime(moment().unix());
            setPaused(!paused);
          }}
          style={{
            height: DevicePixels[50],
            width: DevicePixels[50],
            borderRadius: DevicePixels[25],
            backgroundColor: colors.appWhite,
            position: 'absolute',
            top: '18%',
            left: Dimensions.get('window').width / 2 - DevicePixels[25],
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={paused ? 'play' : 'pause'}
            color={colors.appBlue}
            size={DevicePixels[20]}
            style={{marginRight: paused ? -DevicePixels[3] : 0}}
          />
        </TouchableOpacity>
      )}
      {showControls && Platform.OS === 'ios' && (
        <TouchableOpacity
          onPress={() => ref.current?.presentFullscreenPlayer()}
          style={{
            position: 'absolute',
            top: '37%',
            right: DevicePixels[20],
          }}>
          <Icon
            name="expand"
            color={colors.appWhite}
            size={DevicePixels[30]}
            style={{marginRight: paused ? -DevicePixels[3] : 0}}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

export default ExerciseVideo;
