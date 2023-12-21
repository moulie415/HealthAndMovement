import {View, SectionList, Alert} from 'react-native';
import React, {useEffect, useMemo} from 'react';
import {
  MyRootState,
  Plan,
  PlanExercise,
  PlanWorkout,
} from '../../../types/Shared';
import {connect} from 'react-redux';
import moment from 'moment';

import Text from '../../commons/Text';
import Exercise from '../../../types/Exercise';
import Test from '../../../types/Test';
import colors from '../../../constants/colors';
import {navigate} from '../../../RootNavigation';
import WorkoutCard from '../../commons/WorkoutCard';
import { getExercisesById, setWorkout } from '../../../reducers/exercises';
import { getTestsById } from '../../../reducers/tests';

const Weekly: React.FC<{
  plan?: Plan;
  loading: boolean;
  exercises: {[key: string]: Exercise};
  tests: {[key: string]: Test};
  getExercisesById: (ids: string[]) => void;
  getTestsById: (ids: string[]) => void;
  setWorkout: (workout: Exercise[]) => void;
}> = ({
  plan,
  exercises,
  tests: testsObj,
  getExercisesById: getExercisesByIdAction,
  getTestsById: getTestsByIdAction,
  loading,
  setWorkout: setWorkoutAction,
}) => {
  const workouts = useMemo(() => {
    if (plan) {
      return (
        plan.workouts?.filter(w =>
          w.dates.find(
            d =>
              (moment(d).isAfter(moment().startOf('day')) ||
                moment(d).isSame(moment().startOf('day'))) &&
              moment(d).isBefore(moment().startOf('day').add(7, 'days')),
          ),
        ) || []
      );
    }
  }, [plan]);

  const sections: {title: string; data: PlanWorkout[]}[] = [];

  for (let i = 0; i < 7; i++) {
    if (workouts) {
      const day = moment().add(i, 'days');
      const data = workouts
        .filter(item => {
          return item.dates.some(date => moment(date).isSame(day, 'day'));
        })
        .map(item => {
          return {...item, today: i === 0};
        });
      if (data.length) {
        sections.push({
          title: `${moment(day).format('dddd')} ${i === 0 ? '(today)' : ''}`,
          data,
        });
      }
    }
  }

  return (
    <View>
      <SectionList
        sections={sections}
        renderSectionHeader={({section: {title}}) => (
          <Text
            style={{
              padding: 5,
              marginLeft: 10,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
        )}
        ListEmptyComponent={
          <View style={{padding: 10}}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.appWhite,
                fontSize: 20,
                marginVertical: 10,
              }}>
              No workouts scheduled for this week
            </Text>
          </View>
        }
        renderItem={({item}) => {
          if ('name' in item) {
            return (
              <WorkoutCard
                plan
                key={item.name}
                item={item}
                onPress={() => {
                  if (item.today) {
                    setWorkoutAction(
                      item.exercises.map(e => {
                        return {
                          ...exercises[e.exercise],
                          ...e,
                        };
                      }),
                    );
                    if (plan) {
                      navigate('PreWorkout', {
                        planWorkout: item,
                        planId: plan.id,
                      });
                    }
                  } else {
                    Alert.alert('Workout not due today', 'View early?', [
                      {text: 'Cancel'},
                      {
                        text: 'Yes',
                        onPress: () => {
                          setWorkoutAction(
                            item.exercises.map(e => {
                              return {
                                ...exercises[e.exercise],
                                ...e,
                              };
                            }),
                          );
                          if (plan) {
                            navigate('PreWorkout', {
                              planWorkout: item,
                              planId: plan.id,
                            });
                          }
                        },
                      },
                    ]);
                  }
                }}
              />
            );
          }
          return null;
        }}
      />
    </View>
  );
};

const mapStateToProps = ({profile, exercises, tests}: MyRootState) => ({
  plan: profile.plan,
  loading: profile.loading,
  exercises: exercises.exercises,
  tests: tests.tests,
});

const mapDispatchToProps = {
  getExercisesById,
  getTestsById,
  setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Weekly);
