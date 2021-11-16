import {Layout, List, ListItem, Text} from '@ui-kitten/components';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomSheet from 'reanimated-bottom-sheet';
import {TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import Exercise from '../../../types/Exercise';
import {Goal, MyRootState} from '../../../types/Shared';
import ExerciseListProps from '../../../types/views/ExerciseList';
import {getExercises, setWorkout} from '../../../actions/exercises';
import {truncate} from '../../../helpers';
import ExerciseBottomSheet from '../../commons/ExerciseBottomSheet';
import globalStyles from '../../../styles/globalStyles';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import DevicePixels from '../../../helpers/DevicePixels';

const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  route,
  navigation,
  getExercisesAction,
  workout,
  setWorkoutAction,
  loading,
  profile,
}) => {
  const {
    strengthArea,
    level,
    goal,
    equipment,
    cardioType,
    warmUp,
    coolDown,
  } = route.params;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise>();
  const [reps, setReps] = useState(15);
  const [sets, setSets] = useState(3);
  const [resistance, setResistance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    getExercisesAction(level, goal, strengthArea, cardioType);
  }, [getExercisesAction, level, goal, strengthArea, cardioType]);

  const selectExercise = (exercise: Exercise) => {
    if (workout.find(e => e.id === exercise.id)) {
      setWorkoutAction(workout.filter(e => e.id !== exercise.id));
    } else {
      setWorkoutAction([
        ...workout,
        {
          ...exercise,
          reps,
          sets,
          resistance,
        },
      ]);
    }
  };

  const filtered = useMemo(
    () =>
      Object.values(exercises).filter(exercise => {
        return (
          exercise.type === goal &&
          (strengthArea === exercise.area ||
            cardioType === exercise.cardioType) &&
          (!exercise.warmUp?.length || warmUp.includes(exercise.warmUp)) &&
          (!exercise.coolDown?.length ||
            coolDown.includes(exercise.coolDown)) &&
          (!exercise.equipment ||
            exercise.equipment.every(item => equipment.includes(item))) &&
          exercise.level === level
        );
      }),
    [
      exercises,
      goal,
      level,
      strengthArea,
      cardioType,
      warmUp,
      coolDown,
      equipment,
    ],
  );
  return (
    <Layout style={{flex: 1}}>
      {!loading && !filtered.length && (
        <Text style={{textAlign: 'center', margin: 20}}>
          Sorry, no exercises found based on your filter, please try altering
          your settings like adding any equipment you might have
        </Text>
      )}
      <List
        style={{flex: 1}}
        data={filtered}
        keyExtractor={(item: Exercise) => item.id}
        renderItem={({item}: {item: Exercise}) => {
          const selected = workout.find(e => e.id === item.id);
          return (
            <>
              <ListItem
                onPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium');
                  } else {
                    navigation.navigate('CustomizeExercise', {exercise: item});
                  }
                }}
                onLongPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium');
                  } else {
                    selectExercise(item);
                  }
                }}
                style={{
                  backgroundColor: selected ? colors.appBlue : undefined,
                }}
                title={item.name}
                description={truncate(item.description, 75)}
                accessoryLeft={() =>
                  !item.premium || profile.premium ? (
                    <Image
                      style={{
                        height: DevicePixels[50],
                        width: DevicePixels[75],
                      }}
                      source={
                        item.thumbnail
                          ? {uri: item.thumbnail.src}
                          : require('../../../images/old_man_stretching.jpeg')
                      }
                    />
                  ) : (
                    <View
                      style={{
                        height: DevicePixels[50],
                        width: DevicePixels[75],
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name="lock" size={DevicePixels[30]} />
                    </View>
                  )
                }
                accessoryRight={() => (
                  <TouchableOpacity style={{padding: DevicePixels[10]}}>
                    <Icon
                      name="ellipsis-h"
                      color={selected ? '#fff' : colors.appBlue}
                      size={DevicePixels[20]}
                      onPress={() => {
                        if (item.premium && !profile.premium) {
                          navigation.navigate('Premium');
                        } else {
                          setSelectedExercise(item);
                          bottomSheetRef.current.snapTo(0);
                          setModalOpen(true);
                        }
                      }}
                    />
                  </TouchableOpacity>
                )}
              />
              {item.premium && !profile.premium && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Premium')}
                  style={{
                    position: 'absolute',
                    height: DevicePixels[70],
                    backgroundColor: 'rgba(0,0,0, 0.5)',
                    width: '100%',
                  }}>
                  <Text />
                </TouchableOpacity>
              )}
            </>
          );
        }}
      />
      <AbsoluteSpinner loading={!filtered.length && loading} />
      <ExerciseBottomSheet
        selectedExercise={selectedExercise}
        bottomSheetRef={bottomSheetRef}
        reps={reps}
        sets={sets}
        resistance={resistance}
        setSets={setSets}
        setReps={setReps}
        setResistance={setResistance}
        setOpen={setModalOpen}
        open={modalOpen}
      />
    </Layout>
  );
};

const mapStateToProps = ({exercises, profile}: MyRootState) => ({
  exercises: exercises.exercises,
  workout: exercises.workout,
  loading: exercises.loading,
  profile: profile.profile,
});

const mapDispatchToProps = {
  getExercisesAction: getExercises,
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseList);