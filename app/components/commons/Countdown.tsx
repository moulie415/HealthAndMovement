import Sound from 'react-native-sound';
import React from 'react';
import {FunctionComponent} from 'react';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import crashlytics from '@react-native-firebase/crashlytics';
import colors from '../../constants/colors';
import {useState} from 'react';
import {useEffect} from 'react';
import {View} from 'react-native';
import {Text} from '@ui-kitten/components';

const countdown = new Sound('countdown.wav', Sound.MAIN_BUNDLE, e => {
  if (e) {
    console.warn('failed to load the sound', e);
    console.log(e.code);
    return;
  }
});

const Countdown: FunctionComponent<{onComplete?: () => void}> = ({
  onComplete,
}) => {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    countdown.play(success => {
      if (!success) {
        crashlytics().log('countdown audio failed');
      }
    });
    setPlaying(true);
    return () => {
      countdown.stop();
    };
  }, []);
  if (playing) {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}>
        <CountdownCircleTimer
          isPlaying={playing}
          onComplete={() => {
            setPlaying(false);
            onComplete && onComplete();
          }}
          duration={10}
          children={({remainingTime}) => {
            const seconds = remainingTime % 60;
            return (
              <Text category="h1" style={{color: '#fff'}}>
                {seconds}
              </Text>
            );
          }}
          trailColor="transparent"
          colors={colors.appBlue}
        />
      </View>
    );
  }
  return null;
};

export default Countdown;