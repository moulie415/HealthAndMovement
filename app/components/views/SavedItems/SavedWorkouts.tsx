import React, {FunctionComponent, useEffect} from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import moment from 'moment';
import {SavedQuickRoutine, SavedWorkout} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import QuickRoutine from '../../../types/QuickRoutines';
import SavedWorkoutCard from '../../commons/SavedWorkoutCard';
import {getSavedQuickRoutines} from '../../../reducers/quickRoutines';
import {getSavedWorkouts} from '../../../reducers/exercises';

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedWorkouts: FunctionComponent<{
  loading: boolean;
  savedWorkouts: {[key: string]: SavedWorkout};
  navigation: SavedItemsNavigationProp;
  getSavedWorkoutsAction: () => void;
  savedQuickRoutines: {[key: string]: SavedQuickRoutine};
  getSavedQuickRoutinesAction: () => void;
}> = ({
  loading,
  savedWorkouts,
  getSavedWorkoutsAction,
  navigation,
  getSavedQuickRoutinesAction,
  savedQuickRoutines,
}) => {
  useEffect(() => {
    getSavedWorkoutsAction();
  }, [getSavedWorkoutsAction]);

  useEffect(() => {
    getSavedQuickRoutinesAction();
  }, [getSavedQuickRoutinesAction]);

  return (
    <>
      <View>
        <FlatList
          data={[
            ...Object.values(savedWorkouts),
            ...Object.values(savedQuickRoutines),
          ].sort((a, b) => moment(b).valueOf() - moment(a).valueOf())}
          keyExtractor={item => item.id || ''}
          renderItem={({item}) => {
            return <SavedWorkoutCard item={item} navigation={navigation} />;
          }}
        />
      </View>
    </>
  );
};

const mapStateToProps = ({exercises, quickRoutines}: MyRootState) => ({
  loading: exercises.loading,
  savedWorkouts: exercises.savedWorkouts,
  savedQuickRoutines: quickRoutines.savedQuickRoutines,
});

const mapDispatchToProps = {
  getSavedWorkoutsAction: getSavedWorkouts,
  getSavedQuickRoutinesAction: getSavedQuickRoutines,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedWorkouts);
