import {Button, Layout, Spinner} from '@ui-kitten/components';
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
import {MyRootState} from '../../../types/Shared';
import StartWorkoutProps from '../../../types/views/StartWorkout';
import {downloadVideo, setExerciseNote} from '../../../actions/exercises';
import ExerciseVideo from '../../commons/ExerciseVideo';
import {getVideoHeight} from '../../../helpers';
import Countdown from '../../commons/Countdown';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import MusclesDiagram from '../../commons/MusclesDiagram';
import ViewMore from '../../commons/ViewMore';
import Animated, {FadeIn} from 'react-native-reanimated';

const StartWorkout: React.FC<StartWorkoutProps> = ({
  workout,
  navigation,
  exerciseNotes,
  setExerciseNoteAction,
  downloadVideoAction,
  videos,
  loading,
  profile,
}) => {
  const [index, setIndex] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const pagerRef = useRef<PagerView>();
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const textInputRef = useRef<TextInput>();

  useEffect(() => {
    downloadVideoAction(workout[index].id);
  }, [index, workout, downloadVideoAction]);

  useEffect(() => {
    if (workoutStarted) {
      const start = moment().unix();
      const intervalID = setInterval(() => {
        setSeconds(Math.floor(moment().unix() - start));
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [workoutStarted]);

  useEffect(() => {
    if (tabIndex === 2) {
      textInputRef.current?.focus();
    }
  }, [tabIndex]);

  useEffect(() => {
    if (workout[index]) {
      navigation.setOptions({headerTitle: workout[index].name});
    }
  }, [index, navigation, workout]);

  const getResistanceString = (resistance: number) => {
    if (resistance) {
      return `/ ${
        resistance === 0
          ? 'Bodyweight'
          : `${resistance} ${profile.unit === 'metric' ? 'kg' : 'lbs'}`
      }`;
    }
    return '';
  };

  return (
    <Layout style={{flex: 1}}>
      <Countdown onComplete={() => setWorkoutStarted(true)} />
      <ScrollView
        contentContainerStyle={{
          minHeight: Dimensions.get('screen').height + DevicePixels[100],
        }}
        keyboardShouldPersistTaps="always">
        <PagerView
          ref={pagerRef}
          onPageSelected={e => {
            setIndex(e.nativeEvent.position);
          }}
          style={{flex: 1, paddingHorizontal: 0}}>
          {workout.map((exercise, index) => {
            const video: {src: string; path: string} | undefined =
              videos[exercise.id];
            const next = workout[index + 1];

            return (
              <View key={exercise.id}>
                {!loading &&
                video &&
                exercise.video &&
                video.src === exercise.video.src ? (
                  <ExerciseVideo paused={!workoutStarted} path={video.path} />
                ) : (
                  <Layout
                    style={{
                      height: getVideoHeight(),
                      marginBottom: DevicePixels[10],
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Spinner />
                  </Layout>
                )}
                {workout[index + 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index + 1)}
                    style={{
                      position: 'absolute',
                      right: DevicePixels[5],
                      top: '18%',
                      zIndex: 9,
                      padding: DevicePixels[10],
                    }}>
                    <Icon
                      name="chevron-right"
                      size={DevicePixels[30]}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}
                {workout[index - 1] && (
                  <TouchableOpacity
                    onPress={() => pagerRef.current.setPage(index - 1)}
                    style={{
                      position: 'absolute',
                      left: DevicePixels[5],
                      top: '18%',
                      zIndex: 9,
                      padding: DevicePixels[10],
                    }}>
                    <Icon
                      name="chevron-left"
                      size={DevicePixels[30]}
                      color="#fff"
                    />
                  </TouchableOpacity>
                )}

                <Text
                  category="h5"
                  style={{
                    textAlign: 'center',
                    marginTop: DevicePixels[10],
                  }}>{`${exercise.reps} reps / ${
                  exercise.sets
                } sets ${getResistanceString(exercise.resistance)}`}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: DevicePixels[10],
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: tabIndex === 0 ? colors.appBlue : '#fff',
                      padding: DevicePixels[5],
                      width: DevicePixels[80],
                      borderWidth: DevicePixels[1],
                      borderColor: colors.appBlue,
                      borderTopLeftRadius: DevicePixels[5],
                      borderBottomLeftRadius: DevicePixels[5],
                    }}
                    onPress={() => setTabIndex(0)}>
                    <Text
                      style={{
                        color: tabIndex === 0 ? '#fff' : colors.appBlue,
                        textAlign: 'center',
                      }}>
                      Description
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: tabIndex === 1 ? colors.appBlue : '#fff',
                      padding: DevicePixels[5],
                      width: DevicePixels[80],
                      borderWidth: DevicePixels[1],
                      borderColor: colors.appBlue,
                    }}
                    onPress={() => setTabIndex(1)}>
                    <Text
                      style={{
                        color: tabIndex === 1 ? '#fff' : colors.appBlue,
                        textAlign: 'center',
                      }}>
                      Diagram
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: tabIndex === 2 ? colors.appBlue : '#fff',
                      padding: DevicePixels[5],
                      width: DevicePixels[80],
                      borderWidth: DevicePixels[1],
                      borderColor: colors.appBlue,
                      borderTopRightRadius: DevicePixels[5],
                      borderBottomRightRadius: DevicePixels[5],
                    }}
                    onPress={() => setTabIndex(2)}>
                    <Text
                      style={{
                        color: tabIndex === 2 ? '#fff' : colors.appBlue,
                        textAlign: 'center',
                      }}>
                      Notes
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{height: DevicePixels[250]}}>
                  {tabIndex === 0 && (
                    <ViewMore text={exercise.description} lines={10} />
                  )}
                  {tabIndex === 1 && (
                    <MusclesDiagram
                      primary={exercise.muscles}
                      secondary={exercise.musclesSecondary}
                    />
                  )}
                  {tabIndex === 2 && (
                    <TextInput
                      ref={textInputRef}
                      style={{
                        margin: DevicePixels[10],
                        borderWidth: DevicePixels[1],
                        height: DevicePixels[100],
                        textAlignVertical: 'top',
                        borderRadius: DevicePixels[10],
                        borderColor: colors.appBlue,
                        padding: DevicePixels[10],
                      }}
                      placeholder="Enter notes here..."
                      multiline
                      value={exerciseNotes[exercise.id]}
                      onChangeText={text =>
                        setExerciseNoteAction(exercise.id, text)
                      }
                    />
                  )}
                </View>

                <Layout style={{margin: DevicePixels[10]}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: DevicePixels[10],
                    }}>
                    <Text category="h6">{`Exercise ${index + 1}/${
                      workout.length
                    }`}</Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon
                        name="stopwatch"
                        size={DevicePixels[15]}
                        color={colors.darkBlue}
                      />
                      <Text category="h6" style={{marginLeft: DevicePixels[5]}}>
                        {moment()
                          .utc()
                          .startOf('day')
                          .add({seconds})
                          .format('mm:ss')}
                      </Text>
                    </View>
                  </View>
                  {next && (
                    <Text
                      category="h6"
                      style={{marginBottom: DevicePixels[10]}}>
                      Up next
                    </Text>
                  )}
                  {next && (
                    <TouchableOpacity
                      onPress={() => pagerRef.current.setPage(index + 1)}
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        backgroundColor: colors.button,
                      }}>
                      <Image
                        style={{
                          height: DevicePixels[70],
                          width: DevicePixels[90],
                        }}
                        source={
                          next.thumbnail
                            ? {uri: next.thumbnail.src}
                            : require('../../../images/old_man_stretching.jpeg')
                        }
                      />
                      <Layout
                        style={{
                          marginLeft: DevicePixels[20],
                          justifyContent: 'space-evenly',
                          flex: 1,
                          backgroundColor: colors.button,
                        }}>
                        <Text>{next.name}</Text>
                        <Text>{`${next.reps} reps ${next.sets} sets`}</Text>
                      </Layout>
                    </TouchableOpacity>
                  )}
                </Layout>

                <Button
                  onPress={() => {
                    Alert.alert('End Workout', 'Are you sure?', [
                      {text: 'No', style: 'cancel'},
                      {
                        text: 'Yes',
                        onPress: () => {
                          navigation.navigate('EndWorkout', {seconds});
                        },
                      },
                    ]);
                  }}
                  style={{margin: DevicePixels[10]}}>
                  End workout
                </Button>
              </View>
            );
          })}
        </PagerView>
      </ScrollView>
    </Layout>
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
  setExerciseNoteAction: setExerciseNote,
  downloadVideoAction: downloadVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartWorkout);
