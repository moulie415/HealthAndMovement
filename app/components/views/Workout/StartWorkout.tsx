import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Image from 'react-native-fast-image';
import PagerView from 'react-native-pager-view';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import {MyRootState, PauseEvent, UpdateProfilePayload} from '../../../types/Shared';
import ExerciseVideo from '../../commons/ExerciseVideo';
import {getVideoHeight} from '../../../helpers';
import Text from '../../commons/Text';
import MusclesDiagram from '../../commons/MusclesDiagram';
import ViewMore from '../../commons/ViewMore';
import Modal from '../../commons/Modal';
import ResistanceScaleInfo from './ResistanceScaleInfo';
import Button from '../../commons/Button';
import Spinner from '../../commons/Spinner';
import Header from '../../commons/Header';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import LinearGradient from 'react-native-linear-gradient';
import Input from '../../commons/Input';
import FastImage from 'react-native-fast-image';
import useInterval from '../../../hooks/UseInterval';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Exercise from '../../../types/Exercise';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import Profile from '../../../types/Profile';
import WorkoutTabs from '../../commons/WorkoutTabs';
import WorkoutTabFooter from '../../commons/WorkoutTabFooter';
import useWorkoutTimer from '../../../hooks/UseWorkoutTimer';
import useExerciseEvents from '../../../hooks/UseExerciseEvents';
import Toggle from '../../commons/Toggle';
import {FONTS_SIZES} from '../../../constants';
import {workoutSong} from '../../../sagas/profile';
import playWorkoutSong from '../../../helpers/playWorkoutSong';
import { updateProfile } from '../../../reducers/profile';

const StartWorkout: React.FC<{
  workout: Exercise[];
  exerciseNotes: {[key: string]: string};
  navigation: NativeStackNavigationProp<StackParamList, 'StartWorkout'>;
  route: RouteProp<StackParamList, 'StartWorkout'>;
  videos: {[key: string]: {src: string; path: string}};
  loading: boolean;
  profile: Profile;
  updateProfile: (payload: UpdateProfilePayload) => void;
}> = ({
  workout,
  navigation,
  loading,
  profile,
  route,
  updateProfile: updateProfileAction,
}) => {
  const [index, setIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const [showModal, setShowModal] = useState(false);
  const [showResistanceModal, setShowResistanceModal] = useState(false);
  const [hasPressedPlay, setHasPressedPlay] = useState(true);
  const planWorkout = route.params?.planWorkout;
  const startTime = route.params?.startTime;
  const planId = route.params?.planId;
  const [fullscreen, setFullScreen] = useState(false);
  const [pauseEvents, setPauseEvents] = useState<PauseEvent[]>([]);

  const {seconds, setTimerPaused, timerPaused} = useWorkoutTimer(1000);
  const {exerciseEvents} = useExerciseEvents(index);

  const loadingExercises = !workout || workout.some(e => e === undefined);

  const setAutoPlay = (autoPlay: boolean) => updateProfileAction({autoPlay});

  useEffect(() => {
    if (profile.workoutMusic) {
      playWorkoutSong();
    }
  }, [profile.workoutMusic]);

  return (
    <View style={{flex: 1}}>
      <Header
        hasBack
        absolute
        // right={
        //   planWorkout.steps ? (
        //     <TouchableOpacity
        //       style={{marginTop: 10}}
        //       onPress={() => setShowModal(true)}>
        //       <Icon name="info-circle" color={colors.appWhite} size={30} />
        //     </TouchableOpacity>
        //   ) : null
        // }
        customBackPress={() => {
          Alert.alert('Exit workout', 'Are you sure?', [
            {
              text: 'No',
            },
            {
              text: 'Yes',
              onPress: () => {
                navigation.goBack();
                if (workoutSong.isPlaying()) {
                  workoutSong.stop();
                }
              },
            },
          ]);
        }}
      />

      {loadingExercises ? (
        <AbsoluteSpinner loading text="Loading exercises..." />
      ) : (
        <PagerView
          ref={pagerRef}
          onPageSelected={e => {
            setIndex(e.nativeEvent.position);
          }}
          scrollEnabled={!fullscreen}
          style={{flex: 1, paddingHorizontal: 0}}>
          {workout.map((exercise, i) => {
            const next = workout[index + 1];
            return (
              <View key={`${exercise.id}${i}`}>
                {!loading && exercise.video ? (
                  <ExerciseVideo
                    path={exercise.video.src}
                    videoIndex={i}
                    currentIndex={index}
                    hasPressedPlay={hasPressedPlay}
                    setHasPressedPlay={setHasPressedPlay}
                    fullscreen={fullscreen}
                    setFullScreen={setFullScreen}
                  />
                ) : (
                  <View
                    style={{
                      height: getVideoHeight(),
                      marginBottom: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                    }}>
                    <Spinner color={colors.appBlue} />
                  </View>
                )}
                {!fullscreen && (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      top: getVideoHeight() - 30,
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                      overflow: 'hidden',
                      backgroundColor: colors.appGrey,
                    }}>
                    <ScrollView
                      contentContainerStyle={{paddingBottom: 20}}
                      keyboardShouldPersistTaps="always">
                      <Text
                        style={{
                          marginTop: 20,
                          color: colors.appWhite,
                          fontSize: 20,
                          marginHorizontal: 40,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}>
                        {exercise.name}
                      </Text>
                      <WorkoutTabs
                        tabIndex={tabIndex}
                        setTabIndex={setTabIndex}
                        exercise={exercise}
                        i={i}
                        index={index}
                        workout={workout}
                        pagerRef={pagerRef}
                        timerPaused={timerPaused}
                        onTimerPaused={paused => {
                          setTimerPaused(paused);
                          setPauseEvents([
                            ...pauseEvents,
                            {time: new Date(), paused},
                          ]);
                        }}
                      />

                      {/* <WorkoutTabFooter
                        onTimerPaused={paused =>
                          setPauseEvents([
                            ...pauseEvents,
                            {time: new Date(), paused},
                          ])
                        }
                        seconds={seconds}
                        setTimerPaused={setTimerPaused}
                        timerPaused={timerPaused}
                        workout={workout}
                        index={index}
                      /> */}
                      <View style={{flexDirection: 'row', flex: 1}}>
                        {index === 0 && (
                          <TouchableOpacity
                            onPress={() => setAutoPlay(!profile.autoPlay)}
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: colors.tile,
                              borderRadius: 12,
                              marginLeft: 20,
                              justifyContent: 'space-evenly',
                              height: 50,
                            }}>
                            <Text
                              style={{
                                color: colors.appWhite,
                                fontSize: FONTS_SIZES.SMALL,
                                fontWeight: 'bold',
                              }}>
                              AUTO-PLAY
                            </Text>
                            <Toggle
                              value={profile.autoPlay}
                              onValueChange={setAutoPlay}
                            />
                          </TouchableOpacity>
                        )}
                        {index !== 0 && (
                          <Button
                            text="Previous"
                            variant="secondary"
                            onPress={() => pagerRef.current?.setPage(index - 1)}
                            style={{
                              marginLeft: 20,
                              marginHorizontal: 10,
                              flex: 1,
                            }}
                          />
                        )}

                        {index !== planWorkout?.exercises.length - 1 && (
                          <Button
                            text="Next"
                            onPress={() => pagerRef.current?.setPage(index + 1)}
                            style={{
                              marginRight: 20,
                              marginHorizontal: index === 0 ? 20 : 10,
                              flex: 1,
                            }}
                          />
                        )}
                        {index === planWorkout?.exercises.length - 1 && (
                          <Button
                            text="End Workout"
                            onPress={() => {
                              Alert.alert('End workout', 'Are you sure?', [
                                {text: 'No', style: 'cancel'},
                                {
                                  text: 'Yes',
                                  onPress: () => {
                                    navigation.navigate('EndWorkout', {
                                      seconds,
                                      planWorkout,
                                      endTime: new Date(),
                                      exerciseEvents,
                                      pauseEvents,
                                      startTime,
                                      planId,
                                    });
                                    if (workoutSong.isPlaying()) {
                                      workoutSong.stop();
                                    }
                                  },
                                },
                              ]);
                            }}
                            style={{
                              marginRight: 20,
                              marginHorizontal: 10,
                              flex: 1,
                            }}
                          />
                        )}
                      </View>
                    </ScrollView>
                  </View>
                )}
              </View>
            );
          })}
        </PagerView>
      )}
      <Modal
        visible={showResistanceModal}
        onRequestClose={() => setShowResistanceModal(false)}>
        <View
          style={{
            backgroundColor: '#fff',
            alignSelf: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              padding: 15,
            }}>
            Resistance scale explained
          </Text>
          <ResistanceScaleInfo />
          <Button
            text="OK"
            onPress={() => setShowResistanceModal(false)}
            style={{margin: 10}}
          />
        </View>
      </Modal>
      {/* <MusicButton /> */}
    </View>
  );
};

const mapStateToProps = ({exercises, profile}: MyRootState) => ({
  workout: exercises.workout,
  exerciseNotes: exercises.exerciseNotes,
  videos: exercises.videos,
  loading: exercises.videoLoading,
  profile: profile.profile,
});

const mapDispatchToProps = {
  updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartWorkout);
