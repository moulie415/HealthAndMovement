import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import WorkoutCard from '../../commons/WorkoutCard';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import Exercise from '../../../types/Exercise';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import colors from '../../../constants/colors';
import moment from 'moment';
import { setWorkout } from '../../../reducers/exercises';

const MonthlyDayView: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'MonthlyDayView'>;
  route: RouteProp<StackParamList, 'MonthlyDayView'>;
  setWorkout: (workout: Exercise[]) => void;
  exercises: {[key: string]: Exercise};
}> = ({navigation, route, setWorkout: setWorkoutAction, exercises}) => {
  const {workouts, date, planId} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title={moment(date).format('MMMM Do')} />
        <ScrollView>
          {workouts.map(workout => {
            return (
              <WorkoutCard
                plan
                key={workout.name}
                item={workout}
                onPress={() => {
                  setWorkoutAction(
                    workout.exercises.map(e => {
                      return {
                        ...exercises[e.exercise],
                        ...e,
                      };
                    }),
                  );
                  navigation.navigate('PreWorkout', {
                    planWorkout: workout,
                    planId,
                  });
                }}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  exercises: exercises.exercises,
});

const mapDispatchToProps = {
  setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyDayView);
