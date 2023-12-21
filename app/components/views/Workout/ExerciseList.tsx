import React, {useEffect, useMemo} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import Exercise from '../../../types/Exercise';
import {
  CoolDown,
  Equipment,
  Goal,
  Level,
  MyRootState,
  WarmUp,
} from '../../../types/Shared';
import {truncate} from '../../../helpers';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {FlatList} from 'react-native-gesture-handler';
import Text from '../../commons/Text';
import ListItem from '../../commons/ListItem';
import {getExercises, setWorkout} from '../../../reducers/exercises';
import {StackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import Profile from '../../../types/Profile';

const ExerciseList: React.FC<{
  exercises: {[key: string]: Exercise};
  navigation: NativeStackNavigationProp<StackParamList, 'ExerciseList'>;
  route: RouteProp<StackParamList, 'ExerciseList'>;
  getExercisesAction: ({
    level,
    goal,
    warmUp,
    coolDown,
  }: {
    level: Level;
    goal: Goal;
    warmUp: WarmUp[];
    coolDown: CoolDown[];
  }) => void;
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
  loading: boolean;
  profile: Profile;
}> = ({
  exercises,
  route,
  navigation,
  getExercisesAction,
  workout,
  setWorkoutAction,
  loading,
  profile,
}) => {
  const {level, goal, equipment, warmUp, coolDown} = route.params;

  useEffect(() => {
    getExercisesAction({level, goal, warmUp, coolDown});
  }, [getExercisesAction, level, goal, warmUp, coolDown]);

  const selectExercise = (exercise: Exercise) => {
    if (workout.find(e => e.id === exercise.id)) {
      setWorkoutAction(workout.filter(e => e.id !== exercise.id));
    } else {
      setWorkoutAction([
        ...workout,
        {...exercise, reps: '15', sets: '3', resistance: '0'},
      ]);
    }
  };

  const filtered = useMemo(
    () =>
      Object.values(exercises).filter(exercise => {
        return (
          (exercise.type === goal &&
            (!exercise.equipment ||
              exercise.equipment.every(item => equipment.includes(item)) ||
              ((!exercise.equipment || exercise.equipment.length === 0) &&
                equipment.includes(Equipment.NONE))) &&
            exercise.level === level) ||
          (exercise.warmUp && warmUp.includes(exercise.warmUp)) ||
          (exercise.coolDown && coolDown.includes(exercise.coolDown))
        );
      }),
    [exercises, goal, level, warmUp, coolDown, equipment],
  );
  return (
    <View style={{flex: 1}}>
      {!loading && !filtered.length && (
        <Text style={{textAlign: 'center', margin: 20}}>
          Sorry, no exercises found based on your filter, please try altering
          your settings like adding any equipment you might have
        </Text>
      )}
      <FlatList
        // style={{flex: 1}}
        data={filtered}
        refreshControl={<RefreshControl refreshing={loading} />}
        keyExtractor={(item: Exercise) => item.id || ''}
        renderItem={({item}: {item: Exercise}) => {
          const selected = workout.find(e => e.id === item.id);
          return (
            <>
              <ListItem
                onPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium', {});
                  } else {
                    navigation.navigate('CustomizeExercise', {exercise: item});
                  }
                }}
                onLongPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium', {});
                  } else {
                    selectExercise(item);
                  }
                }}
                style={{
                  backgroundColor: selected ? colors.appBlue : undefined,
                }}
                title={item.name}
                description={truncate(item.description, 75)}
                accessoryLeft={
                  !item.premium || profile.premium ? (
                    <Image
                      style={{
                        height: 50,
                        width: 75,
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
                        height: 50,
                        width: 75,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Icon name="lock" size={30} />
                    </View>
                  )
                }
              />
              {item.premium && !profile.premium && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Premium', {})}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: '#000',
                    opacity: 0.5,
                  }}
                />
              )}
            </>
          );
        }}
      />
    </View>
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
