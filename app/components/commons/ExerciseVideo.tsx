import React from 'react';
import {Platform} from 'react-native';
// @ts-ignore
import VideoPlayer from 'react-native-video-controls';
import Video from 'react-native-video';
import {getVideoHeight} from '../../helpers';
import crashlytics from '@react-native-firebase/crashlytics';

const ExerciseVideo: React.FC<{path: string}> = ({path}) => {
  return (
    <>
      {Platform.OS === 'ios' ? (
        <Video
          source={{uri: path}}
          controls
          onError={e => crashlytics().log(e.error.errorString)}
          style={{height: getVideoHeight(), marginBottom: 10}}
          repeat
        />
      ) : (
        <VideoPlayer
          source={{uri: `file://${path}`}}
          style={{height: getVideoHeight(), marginBottom: 10}}
          disableVolume
          disableBack
          onError={(e: Error) => crashlytics().log(e.message)}
          repeat
        />
      )}
    </>
  );
};

export default ExerciseVideo;
