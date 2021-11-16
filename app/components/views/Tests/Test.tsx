import {Button, Divider, Input, Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import TestProps from '../../../types/views/Test';
import ExerciseVideo from '../../commons/ExerciseVideo';
import {SAMPLE_VIDEO_LINK} from '../../../constants/strings';
import colors from '../../../constants/colors';
import Countdown from '../../commons/Countdown';
import ViewMore from '../../commons/ViewMore';
import Table from '../../commons/Table';
import DevicePixels from '../../../helpers/DevicePixels';
import {useInterstitialAd} from '@react-native-admob/admob';
import {UNIT_ID_INTERSTITIAL} from '../../../constants';

const Test: React.FC<TestProps> = ({route, tests, profile, navigation}) => {
  const {id} = route.params;
  const test = tests[id];
  const [testStarted, setTestStarted] = useState(false);
  const [seconds, setSeconds] = useState(test.time || 0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [complete, setComplete] = useState(false);
  const [testResult, setTestResult] = useState<number>();
  const [testNote, setTestNote] = useState('');
  const [start, setStart] = useState(0);

  const {adLoaded, adDismissed, show} = useInterstitialAd(UNIT_ID_INTERSTITIAL);

  useEffect(() => {
    if (adDismissed) {
      if (test.type === 'untimed') {
        setTestStarted(true);
      } else {
        setShowCountdown(true);
      }
    }
  }, [adDismissed, navigation, test.type]);

  useEffect(() => {
    if (
      testStarted &&
      !complete &&
      (test.type === 'countdown' || test.type === 'countup')
    ) {
      const startCountdown = moment().unix() + seconds;
      const intervalID = setInterval(() => {
        if (test.type === 'countup') {
          setSeconds(moment().unix() - start);
        } else {
          if (seconds > 0) {
            setSeconds(Math.floor(startCountdown - moment().unix()));
          } else {
            setComplete(true);
          }
        }
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [testStarted, test.type, seconds, complete, start]);

  const getTimeString = () => {
    if (test.type === 'untimed') {
      return 'not timed';
    }
    if (test.type === 'countdown' && !(seconds > 0)) {
      return 'Times up!';
    }
    return moment().utc().startOf('day').add({seconds}).format('mm:ss');
  };

  return (
    <Layout style={{flex: 1}}>
      {showCountdown && (
        <Countdown
          onComplete={() => {
            setTestStarted(true);
            setStart(moment().unix());
          }}
        />
      )}
      <Layout
        style={{
          flexDirection: 'row',
          margin: DevicePixels[10],
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Layout
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Icon
            name="stopwatch"
            size={DevicePixels[25]}
            color={colors.darkBlue}
          />
          <Text style={{marginLeft: DevicePixels[10]}} category="h5">
            {getTimeString()}
          </Text>
        </Layout>
      </Layout>
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
        {complete ? (
          <Layout style={{margin: 20}}>
            <Text category="h5" style={{textAlign: 'center', marginBottom: 10}}>
              Test complete!
            </Text>
            {test.type !== 'countup' ? (
              <Text>Enter result of test below</Text>
            ) : (
              <Text style={{fontSize: 20, marginBottom: 10}}>
                Your result:{' '}
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  {moment().utc().startOf('day').add({seconds}).format('mm:ss')}
                </Text>
              </Text>
            )}
            {test.type !== 'countup' && (
              <Input
                value={testResult?.toString()}
                onChangeText={val =>
                  setTestResult(Number(val.replace(/[^0-9]/g, '')))
                }
                keyboardType="numeric"
                style={{width: 100, marginVertical: 5}}
              />
            )}
            <Text>Test note</Text>
            <Input
              value={testNote}
              onChangeText={setTestNote}
              style={{marginVertical: 5}}
              textStyle={{minHeight: DevicePixels[50]}}
              multiline
            />
            <Button
              onPress={() =>
                navigation.navigate('TestResults', {
                  test,
                  testResult,
                  seconds,
                  testNote,
                })
              }
              style={{marginTop: 10}}
              disabled={!testResult && test.type !== 'countup'}>
              See results
            </Button>
          </Layout>
        ) : (
          <>
            <ExerciseVideo paused={!testStarted} path={SAMPLE_VIDEO_LINK} />
            <Text category="h6" style={{marginHorizontal: DevicePixels[10]}}>
              {test.name}
            </Text>
            <Text style={{margin: DevicePixels[10]}}>{test.summary}</Text>
            <Divider />
            <Text style={{margin: DevicePixels[10]}} category="s1">
              How to perform this test
            </Text>
            <ViewMore text={test.how.map(step => `• ${step} \n\n`).join('')} />
            <Divider />
            <Text style={{margin: DevicePixels[10]}} category="s1">
              Why is this test important
            </Text>
            <ViewMore text={test.why} />
            <Divider />
            {test.mens &&
              'age' in test.mens &&
              (profile.gender === 'male' || !profile.gender) && (
                <Table
                  table={test.mens}
                  metric={test.metric}
                  title="Mens table"
                />
              )}
            {test.womens &&
              'age' in test.womens &&
              (profile.gender === 'female' || !profile.gender) && (
                <Table
                  table={test.womens}
                  metric={test.metric}
                  title="Womens table"
                />
              )}
          </>
        )}
      </ScrollView>
      {!(testStarted && test.type === 'countdown') && !complete && (
        <Button
          onPress={() => {
            if (testStarted) {
              setComplete(true);
            } else {
              if (adLoaded && !profile.premium) {
                show();
              } else {
                if (test.type === 'untimed') {
                  setTestStarted(true);
                } else {
                  setShowCountdown(true);
                }
              }
            }
          }}
          style={{
            margin: DevicePixels[10],
            marginBottom: DevicePixels[20],
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}>
          {testStarted ? 'End' : 'Start'}
        </Button>
      )}
    </Layout>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(Test);