import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {FlatList, View} from 'react-native';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import {getDifficultyEmoji} from '../../../helpers/exercises';
import QuickRoutine from '../../../types/QuickRoutines';
import {SavedQuickRoutine} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import ImageOverlay from '../../commons/ImageOverlay';
import ListItem from '../../commons/ListItem';
import Text from '../../commons/Text';
import {getExercisesById} from '../../../reducers/exercises';
import {
  getQuickRoutinesById,
  getSavedQuickRoutines,
} from '../../../reducers/quickRoutines';

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedQuickRoutines: FunctionComponent<{
  loading: boolean;
  savedQuickRoutines: {[key: string]: SavedQuickRoutine};
  getSavedQuickRoutinesAction: () => void;
  quickRoutines: {[key: string]: QuickRoutine};
  navigation: SavedItemsNavigationProp;
  getQuickRoutinesByIdAction: (ids: string[]) => void;
  getExercisesByIdAction: (ids: string[]) => void;
}> = ({
  loading,
  savedQuickRoutines,
  getSavedQuickRoutinesAction,
  quickRoutines,
  navigation,
  getQuickRoutinesByIdAction,
  getExercisesByIdAction,
}) => {
  useEffect(() => {
    getSavedQuickRoutinesAction();
  }, [getSavedQuickRoutinesAction]);

  const missingRoutines = useMemo(() => {
    return Object.values(savedQuickRoutines)
      .filter(routine => !quickRoutines[routine.quickRoutineId])
      .map(routine => routine.quickRoutineId);
  }, [quickRoutines, savedQuickRoutines]);

  useEffect(() => {
    if (missingRoutines.length) {
      getQuickRoutinesByIdAction(missingRoutines);
    }
  }, [getQuickRoutinesByIdAction, missingRoutines]);

  return (
    <>
      <View>
        {!missingRoutines.length && (
          <FlatList
            data={Object.values(savedQuickRoutines)}
            keyExtractor={item => item.id || ''}
            renderItem={({item}) => {
              const quickRoutine = quickRoutines[item.quickRoutineId];
              return (
                <ListItem
                  onPress={() => {
                    getExercisesByIdAction(quickRoutine.exerciseIds);
                    navigation.navigate('PreQuickRoutine', {
                      routine: quickRoutine,
                    });
                  }}
                  title={`${quickRoutine.name} - ${moment(
                    item.createdate,
                  ).format('MMMM Do YYYY')}`}
                  description={`${quickRoutine.exerciseIds?.length} ${
                    quickRoutine.exerciseIds?.length > 1
                      ? 'exercises'
                      : 'exercise'
                  }, ${Math.floor(item.calories)} calories expended`}
                  accessoryLeft={
                    <ImageOverlay
                      containerStyle={{
                        height: 75,
                        width: 75,
                      }}
                      overlayAlpha={0.4}
                      source={
                        quickRoutine.thumbnail
                          ? {uri: quickRoutine.thumbnail.src}
                          : require('../../../images/old_man_stretching.jpeg')
                      }>
                      <View style={{alignItems: 'center'}}>
                        <Text style={{color: '#fff', fontSize: 12}}>
                          {'Duration '}
                        </Text>
                        <Text style={{color: '#fff'}}>
                          {moment()
                            .utc()
                            .startOf('day')
                            .add({seconds: item.seconds})
                            .format('mm:ss')}
                        </Text>
                      </View>
                    </ImageOverlay>
                  }
                  accessoryRight={
                    <Text style={{fontSize: 30}}>
                      {getDifficultyEmoji(item.difficulty)}
                    </Text>
                  }
                />
              );
            }}
          />
        )}
      </View>
      <AbsoluteSpinner loading={loading} />
    </>
  );
};

const mapStateToProps = ({exercises, quickRoutines}: MyRootState) => ({
  loading: exercises.loading,
  savedQuickRoutines: quickRoutines.savedQuickRoutines,
  quickRoutines: quickRoutines.quickRoutines,
});

const mapDispatchToProps = {
  getSavedQuickRoutinesAction: getSavedQuickRoutines,
  getQuickRoutinesByIdAction: getQuickRoutinesById,
  getExercisesByIdAction: getExercisesById,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedQuickRoutines);
