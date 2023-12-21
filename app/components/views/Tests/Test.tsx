import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {Alert, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';
import {getVideoHeight} from '../../../helpers';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import Input from '../../commons/Input';
import Header from '../../commons/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ViewMore from '../../commons/ViewMore';
import FastImageAnimated from '../../commons/FastImageAnimated';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import {calculateVO2Max} from '../../../helpers/tests';
import MyTabs from '../../commons/MyTabs';
import TestTimer from '../../commons/TestTimer';
import useInterval from '../../../hooks/UseInterval';
import TestType from '../../../types/Test';
import {StackParamList} from '../../../App';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import Profile from '../../../types/Profile';
import {navigate, resetToTabs} from '../../../RootNavigation';
import TestResultsModal from './TestResultsModal';
import {SavedTest} from '../../../types/SavedItem';
import useThrottle from '../../../hooks/UseThrottle';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import HistoricalTestsModal from './HistoricalTestsModal';
import {saveTest} from '../../../reducers/tests';

export const PREP_TIME = 5;

const INTERVAL = 100;

const Test: React.FC<{
  tests: {[key: string]: TestType};
  route: RouteProp<StackParamList, 'Test'>;
  navigation: NavigationProp<StackParamList, 'Test'>;
  profile: Profile;
  saveTestAction: (test: SavedTest) => void;
}> = ({route, tests, profile, saveTestAction, navigation}) => {
  const {id} = route.params;
  const test = tests[id];
  const [testStarted, setTestStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [testResult, setTestResult] = useState<number>();
  const [heartRate, setHeartRate] = useState(0);
  const [prepTime, setPrepTime] = useState(PREP_TIME);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewHistorical, setViewHistorical] = useState(false);

  const [testTime, setTestTime] = useState(
    test.type === 'countdown' ? test.time || 0 : 0,
  );

  useInterval(() => {
    if (testStarted && test.type !== 'untimed' && !complete) {
      if (prepTime > 0) {
        const newPrepTime = prepTime - INTERVAL / 1000;
        setPrepTime(newPrepTime < 0 ? 0 : newPrepTime);
      } else {
        if (test.type === 'countup') {
          setTestTime(testTime + INTERVAL / 1000);
        } else if (testTime > 0) {
          setTestTime(testTime - INTERVAL / 1000);
        } else if (test.type === 'countdown') {
          setComplete(true);
        }
      }
    }
  }, INTERVAL);

  const getButtonString = () => {
    if (test.type === 'untimed') {
      return 'Record result';
    }
    if (testStarted) {
      return 'End';
    } else {
      return 'Start';
    }
  };

  const tabs = ['Test', 'Instructions'];

  const isPrepping = testStarted && prepTime > 0;

  const saveThrottled = useThrottle((saved: boolean) => {
    saveTestAction({
      seconds: testTime,
      result: testResult || 0,
      createdate: new Date(),
      testId: test.id,
      saved,
    });
  }, 5000);

  const save = () => {
    if (profile.premium) {
      Alert.alert(
        'Save test result?',
        'Do you want to save this test result to view later?',
        [
          {
            text: 'No',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: () => {
              saveThrottled(true);
            },
          },
        ],
        {cancelable: false},
      );
    } else {
    }
  };

  const handleBackPress = () => {
    if (
      complete &&
      (testResult ||
        (test.type === 'countup' && (heartRate || test.formula !== 'vo2')))
    ) {
      save();
    }
    navigation.goBack();
    return true;
  };

  useBackHandler(handleBackPress);

  return (
    <View style={{flex: 1}}>
      {test.video?.src ? (
        <Video
          source={{uri: convertToProxyURL(test.video?.src)}}
          style={{height: getVideoHeight(), width: '100%'}}
          resizeMode={'cover'}
          repeat
          disableFocus
        />
      ) : (
        <FastImageAnimated
          source={{uri: test.thumbnail.src}}
          style={{
            height: getVideoHeight(),
          }}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#000',
              opacity: 0.4,
            }}
          />
        </FastImageAnimated>
      )}
      <Header hasBack absolute customBackPress={handleBackPress} />

      <View
        style={{
          paddingBottom: 220,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: colors.appGrey,
          top: -30,
        }}>
        {/* <ExerciseVideo paused={!testStarted} path={SAMPLE_VIDEO_LINK} /> */}
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={{paddingBottom: 220}}>
          <Text
            style={{
              marginTop: 20,
              color: colors.appWhite,
              fontSize: 20,
              marginHorizontal: 40,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {test.name}
          </Text>
          <MyTabs tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />

          <TestTimer
            testStarted={testStarted}
            tabIndex={tabIndex}
            test={test}
            prepTime={prepTime}
            testTime={testTime}
            complete={complete}
            testResult={testResult}
            setHeartRate={setHeartRate}
            setTestResult={setTestResult}
            heartRate={heartRate}
          />
          {complete &&
            test.formula === 'vo2' &&
            !!heartRate &&
            tabIndex === 0 && (
              <Text
                style={{
                  fontSize: 18,
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: 20,
                }}>
                {`VO2 max = ${calculateVO2Max(
                  profile,
                  testTime,
                  heartRate,
                )?.toFixed(2)}`}
              </Text>
            )}
          {tabIndex === 1 && (
            <View
              style={{
                marginHorizontal: 20,
                marginVertical: 10,
              }}>
              <ViewMore
                textAlign="justify"
                text={test.summary || ''}
                lines={9}
              />
            </View>
          )}

          <View style={{flexDirection: 'row'}}>
            {testStarted &&
              test.type !== 'untimed' &&
              !complete &&
              !isPrepping && (
                <Button
                  variant={test.type === 'countdown' ? 'primary' : 'secondary'}
                  text="Restart"
                  onPress={() => {
                    if (test.type === 'countup') {
                      setTestTime(0);
                    } else {
                      setTestTime(test.time as number);
                    }
                  }}
                  style={{
                    margin: 10,
                    marginLeft: 20,
                    marginRight: test.type === 'countdown' ? 20 : 10,
                    flex: 1,
                  }}
                />
              )}
            {!(testStarted && test.type === 'countdown') &&
              !complete &&
              !isPrepping && (
                <>
                  <Button
                    variant="secondary"
                    style={{
                      flex: 1,
                      marginRight: 10,
                      marginLeft: 20,
                      margin: 10,
                    }}
                    onPress={() => setViewHistorical(true)}
                    text="Historical"
                  />
                  <Button
                    text={getButtonString()}
                    onPress={() => {
                      setTabIndex(0);
                      if (
                        test.formula === 'vo2' &&
                        (!profile.dob || !profile.weight || !profile.gender)
                      ) {
                        return Alert.alert(
                          'Sorry',
                          "To calculate your VO2 max, you need to make sure you've set your age, weight and sex",
                        );
                      }
                      if (testStarted) {
                        setComplete(true);
                      } else {
                        setTestStarted(true);
                        if (test.type === 'untimed') {
                          setComplete(true);
                        }
                      }
                    }}
                    style={{
                      margin: 10,
                      marginRight: 20,
                      marginLeft: test.type === 'untimed' ? 20 : 10,
                      flex: 1,
                    }}
                  />
                </>
              )}
          </View>
          {complete && (
            <View style={{flexDirection: 'row'}}>
              <Button
                text="Return Home"
                variant="secondary"
                onPress={() => {
                  if (testResult || test.type === 'countup') {
                    save();
                  }
                  resetToTabs();
                }}
                style={{marginLeft: 15, marginRight: 8, flex: 1}}
              />
              <Button
                text="Compare result"
                onPress={() => setModalVisible(true)}
                style={{marginRight: 15, marginLeft: 8, flex: 1}}
                disabled={
                  (!testResult && test.type !== 'countup') ||
                  (test.formula === 'vo2' && !heartRate)
                }
              />
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
      <TestResultsModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        testResult={
          test.formula === 'vo2'
            ? calculateVO2Max(profile, testTime, heartRate) || 0
            : testResult
        }
        seconds={testTime}
        test={test}
      />
      <HistoricalTestsModal
        visible={viewHistorical}
        test={test}
        onRequestClose={() => setViewHistorical(false)}
      />
    </View>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

const mapDispatchToProps = {
  saveTestAction: saveTest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
