import React, {useEffect, useState} from 'react';
import {resetToTabs} from '../../../RootNavigation';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import FastImage from 'react-native-fast-image';
import WorkoutSummaryInfo from '../../commons/WorkoutSummaryInfo';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import {SavedWorkout} from '../../../types/SavedItem';
import Profile from '../../../types/Profile';
import Exercise from '../../../types/Exercise';
import { saveWorkout, setShareModalVisible } from '../../../reducers/exercises';

const WorkoutSummary: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WorkoutSummary'>;
  route: RouteProp<StackParamList, 'WorkoutSummary'>;
  profile: Profile;
  saveWorkoutAction: (workout: SavedWorkout) => void;
  workout: Exercise[];
  setShareModalVisibleAction: (payload: boolean) => void;
}> = ({route}) => {
  const {calories, seconds, difficulty, averageHeartRate} = route.params;
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useBackHandler(() => true);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <WorkoutSummaryInfo
        calories={calories}
        difficulty={difficulty}
        seconds={seconds}
        averageHeartRate={averageHeartRate}
      />

      <Button
        text="Return Home"
        onPress={resetToTabs}
        style={{
          margin: 20,
          marginTop: 10,
        }}
      />

      {/* <Button
          text="Share workout"
          onPress={() => setShareModalVisibleAction(true)}
          style={{
            margin: 10,
            marginBottom: 20,
          }}
        />
        <ShareModal title="Share workout" type="workout" workout={workout} /> */}
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile, exercises}: MyRootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

const mapDispatchToProps = {
  saveWorkoutAction: saveWorkout,
  setShareModalVisibleAction: setShareModalVisible,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutSummary);
