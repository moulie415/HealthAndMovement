import {Dimensions, FlatList, ImageBackground, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import QuickRoutine from '../../../types/QuickRoutines';
import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';
import Profile from '../../../types/Profile';
import {SettingsState} from '../../../reducers/settings';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {SafeAreaView} from 'react-native-safe-area-context';
import Exercise from '../../../types/Exercise';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import Header from '../../commons/Header';
import WorkoutCard from '../../commons/WorkoutCard';
import FastImage from 'react-native-fast-image';
import colors from '../../../constants/colors';
import {
  getQuickRoutines,
  startQuickRoutine,
} from '../../../reducers/quickRoutines';
import {getExercisesById} from '../../../reducers/exercises';

const {height} = Dimensions.get('screen');

const WorkoutList: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WorkoutList'>;
  route: RouteProp<StackParamList, 'WorkoutList'>;
  quickRoutines: {[key: string]: QuickRoutine};
  getQuickRoutines: () => void;
  getExercisesById: (ids: string[]) => void;
  profile: Profile;
  settings: SettingsState;
  exercises: {[key: string]: Exercise};
  loading: boolean;
  startQuickRoutine: (routine: QuickRoutine) => void;
}> = ({
  navigation,
  route,
  getQuickRoutines: getQuickRoutinesAction,
  quickRoutines,
  getExercisesById: getExercisesByIdAction,
  profile,
  settings,
  exercises,
  loading,
  startQuickRoutine: startQuickRoutineAction,
}) => {
  const {area, equipment} = route.params;

  const [selectedItem, setSelectedItem] = useState<QuickRoutine>();

  const {load, show, isLoaded, isClosed} = useInterstitialAd(
    UNIT_ID_INTERSTITIAL,
    {
      keywords: AD_KEYWORDS,
    },
  );

  useEffect(() => {
    if (settings.ads) {
      load();
    }
  }, [settings.ads, load]);

  useEffect(() => {
    if (isClosed && settings.ads) {
      load();
    }
  }, [isClosed, load, settings.ads]);

  useEffect(() => {
    getQuickRoutinesAction();
  }, [getQuickRoutinesAction]);
  useEffect(() => {
    if (quickRoutines) {
      const ids: string[] = Object.values(quickRoutines).reduce(
        (acc: string[], cur) => {
          const missing = cur.exerciseIds.filter(e => !exercises[e]);
          return [...acc, ...missing];
        },
        [],
      );
      if (ids && ids.length) {
        getExercisesByIdAction(ids);
      }
    }
  }, [exercises, quickRoutines, getExercisesByIdAction]);

  useEffect(() => {
    if (isClosed && selectedItem) {
      getExercisesByIdAction(selectedItem.exerciseIds);
      navigation.navigate('PreQuickRoutine', {routine: selectedItem});
      startQuickRoutineAction(selectedItem);
    }
  }, [
    isClosed,
    navigation,
    selectedItem,
    getExercisesByIdAction,
    startQuickRoutineAction,
  ]);

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      routine.area === area &&
      (routine.equipment === equipment || equipment === 'full')
    );
  });

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack />
        <FlatList
          ListEmptyComponent={() => (
            <SafeAreaView style={{height: height / 2}}>
              <AbsoluteSpinner
                loading
                style={{backgroundColor: colors.appGrey}}
              />
            </SafeAreaView>
          )}
          data={filtered}
          renderItem={({item}) => {
            return (
              <WorkoutCard
                key={item.id}
                item={item}
                onPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium', {});
                  } else if (isLoaded && !profile.premium && settings.ads) {
                    setSelectedItem(item);
                    show();
                  } else {
                    getExercisesByIdAction(item.exerciseIds);
                    navigation.navigate('PreQuickRoutine', {routine: item});
                    startQuickRoutineAction(item);
                  }
                }}
              />
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({
  quickRoutines,
  profile,
  settings,
  exercises,
}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
  profile: profile.profile,
  settings,
  exercises: exercises.exercises,
  loading: exercises.loading,
});

const mapDispatchToProps = {
  getQuickRoutines,
  getExercisesById,
  startQuickRoutine,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutList);
