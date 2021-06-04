import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Exercise from '../Exercise';

type CustomizeExerciseRouteProp = RouteProp<
  StackParamList,
  'CustomizeExercise'
>;

type CustomizeExerciseNavigationProp = StackNavigationProp<
  StackParamList,
  'CustomizeExercise'
>;

export default interface CustomizeExerciseProps {
  route: CustomizeExerciseRouteProp;
  workout: Exercise[];
  setWorkoutAction: (workout: Exercise[]) => void;
  navigation: CustomizeExerciseNavigationProp;
}
