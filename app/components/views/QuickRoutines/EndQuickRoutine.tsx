import React, {useMemo, useState, useEffect} from 'react';
import {Alert, View} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {saveWorkout} from '../../../helpers/biometrics';
import {saveQuickRoutine} from '../../../actions/quickRoutines';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import RPESlider from '../../commons/RPESlider';
import useThrottle from '../../../hooks/UseThrottle';
import useWorkoutData from '../../../hooks/UseWorkoutData';
import {setProfile} from '../../../actions/profile';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import Exercise from '../../../types/Exercise';
import {SavedQuickRoutine} from '../../../types/SavedItem';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';

const EndQuickRoutine: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'EndQuickRoutine'>;
  route: RouteProp<StackParamList, 'EndQuickRoutine'>;
  profile: Profile;
  workout: Exercise[];
  saveQuickRoutine: (payload: SavedQuickRoutine) => void;
  setProfile: (profile: Profile) => void;
}> = ({
  route,
  navigation,
  profile,
  workout,
  saveQuickRoutine: saveQuickRoutineAction,
  setProfile: setProfileAction,
}) => {
  const [difficulty, setDifficulty] = useState(1);
  const [loading, setLoading] = useState(false);

  const [note, setNote] = useState('');
  const {seconds, routine, endTime, exerciseEvents, startTime, pauseEvents} =
    route.params;

  const {
    loading: isLoading,
    averageHeartRate,
    heartRateSamples,
    calories,
    fitbitData,
  } = useWorkoutData(seconds, profile, difficulty, endTime, setProfileAction);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const save = useThrottle((saved: boolean) => {
    saveQuickRoutineAction({
      calories: calories || 0,
      seconds,
      difficulty,
      createdate: new Date(),
      quickRoutineId: routine.id,
      saved,
      averageHeartRate,
      heartRateSamples,
      exerciseEvents,
      pauseEvents,
      startTime,
      endTime,
      fitbitData,
    });
  }, 3000);

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Workout Complete!" />
        <View style={{flex: 1, marginTop: 40}}>
          <RPESlider setRpe={setDifficulty} rpe={difficulty} />
          {/* <Text style={{color: colors.appWhite, margin: 10}}>
          Workout note
        </Text>
        <Input
          style={{minHeight: 50, margin: 10}}
          multiline
          placeholder="Add details about this workout"
          value={note}
          onChangeText={setNote}
        /> */}
          <Button
            text="Save & Continue"
            disabled={loading}
            style={{margin: 10}}
            onPress={async () => {
              setLoading(true);
              await saveWorkout(
                seconds,
                'CA Health workout',
                routine.name,
                calories || 0,
              );
              const navigate = () => {
                navigation.navigate('QuickRoutineSummary', {
                  calories,
                  seconds,
                  difficulty,
                  routine,
                  averageHeartRate,
                });
              };

              if (profile.premium) {
                Alert.alert(
                  'Save workout',
                  'Do you wish to save this workout to view later?',
                  [
                    {
                      style: 'cancel',
                      text: 'Cancel',
                      onPress: () => setLoading(false),
                    },
                    {
                      text: 'No',
                      onPress: () => {
                        save(false);
                        navigate();
                      },
                    },
                    {
                      text: 'Yes',
                      onPress: () => {
                        save(true);
                        navigate();
                      },
                    },
                  ],
                );
              } else {
                save(false);
                navigate();
              }
            }}
          />
        </View>
      </SafeAreaView>
      <AbsoluteSpinner loading={loading} text="Loading workout data" />
    </View>
  );
};

const mapStateToProps = ({profile, exercises}: MyRootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

const mapDispatchToProps = {
  saveQuickRoutine,
  setProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(EndQuickRoutine);
