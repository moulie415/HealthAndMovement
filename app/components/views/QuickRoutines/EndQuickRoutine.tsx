import {Button, Input, Layout, Text} from '@ui-kitten/components';
import Slider from '@react-native-community/slider';
import React, {useMemo, useState} from 'react';
import EndWorkoutProps from '../../../types/views/EndWorkout';
import {useEffect} from 'react';
import moment from 'moment';
import {Alert, Platform} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {
  difficultyToMET,
  getCaloriesBurned,
  getDifficultyEmoji,
  getDifficultyText,
} from '../../../helpers/exercises';
import {saveWorkout} from '../../../helpers/biometrics';
import DevicePixels from '../../../helpers/DevicePixels';
import EndQuickRoutineProps from '../../../types/views/EndQuickRoutine';
import {saveQuickRoutine} from '../../../actions/quickRoutines';
import persistStore from 'redux-persist/es/persistStore';

const EndQuickRoutine: React.FC<EndQuickRoutineProps> = ({
  route,
  navigation,
  profile,
  workout,
  saveQuickRoutine: saveQuickRoutineAction,
}) => {
  const [difficulty, setDifficulty] = useState(1);
  const [calories, setCalories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const {seconds, routine} = route.params;
  useEffect(() => {
    const getSamples = async () => {
      const startDate = moment().subtract(seconds, 'seconds').toISOString();
      const endDate = moment().toISOString();
      const MET = difficultyToMET(difficulty);
      const calorieEstimate = getCaloriesBurned(
        seconds,
        MET,
        profile.weight,
        profile.unit,
      );
      setLoading(true);
      try {
        await saveWorkout(
          startDate,
          endDate,
          calorieEstimate,
          'CA Health workout',
          routine.name,
        );
        setCalories(calorieEstimate);
        setLoading(false);
      } catch (e) {
        Alert.alert(
          `Error saving workout to ${
            Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'
          }`,
          e.message,
        );
        setLoading(false);
      }
    };
    getSamples();
  }, [
    seconds,
    difficulty,
    profile.unit,
    profile.weight,
    workout,
    routine.name,
  ]);
  const emoji = useMemo(() => getDifficultyEmoji(difficulty), [difficulty]);

  const {text, subtext} = useMemo(() => {
    const difficultyText = getDifficultyText(difficulty);
    if (difficulty === 0) {
      return {text: difficultyText, subtext: 'I could do this all day'};
    }
    if (difficulty === 1) {
      return {
        text: difficultyText,
        subtext: 'That was uncomfortable, but I can still talk easily',
      };
    }
    if (difficulty === 2) {
      return {
        text: difficultyText,
        subtext: "I can't breath or talk, my muscles burn",
      };
    }
    return {text: difficultyText, subtext: 'I might die'};
  }, [difficulty]);
  return (
    <Layout style={{flex: 1}}>
      <Text
        category="h5"
        style={{
          textAlign: 'center',
          margin: DevicePixels[10],
          marginTop: DevicePixels[20],
        }}>
        Workout Complete!
      </Text>
      <Text style={{margin: DevicePixels[10]}}>
        Rate your performance to help us understand your fitness level
      </Text>
      <Text style={{fontSize: DevicePixels[100], textAlign: 'center'}}>
        {emoji}
      </Text>

      <Slider
        style={{
          height: DevicePixels[40],
          flexDirection: 'row',
          margin: DevicePixels[10],
        }}
        minimumValue={0}
        maximumValue={3}
        step={1}
        value={difficulty}
        onValueChange={setDifficulty}
      />
      <Text
        style={{
          fontWeight: 'bold',
          margin: DevicePixels[10],
          height: DevicePixels[50],
          textAlign: 'center',
        }}>
        {text}
        <Text style={{fontWeight: 'normal'}}>{` - ${subtext}`}</Text>
      </Text>
      <Input
        label="Workout note"
        textStyle={{minHeight: DevicePixels[50]}}
        style={{margin: DevicePixels[10], marginTop: 0}}
        multiline
        placeholder="Add details about this workout"
        value={note}
        onChangeText={setNote}
      />
      <Button
        disabled={loading}
        style={{margin: DevicePixels[10]}}
        onPress={() => {
          const navigate = () => {
            navigation.navigate('QuickRoutineSummary', {
              calories,
              seconds,
              difficulty,
              routine,
            });
          };

          const save = (saved?: boolean) => {
            saveQuickRoutineAction({
              calories,
              seconds,
              difficulty,
              createdate: new Date(),
              quickRoutineId: routine.id,
              saved,
            });
          };
          if (profile.premium) {
            Alert.alert(
              'Save workout',
              'Do you wish to save this workout to view later?',
              [
                {style: 'cancel', text: 'Cancel'},
                {
                  text: 'No',
                  onPress: () => {
                    save();
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
            save();
            navigate();
          }
        }}>
        Save & Continue
      </Button>
    </Layout>
  );
};

const mapStateToProps = ({profile, exercises}: MyRootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

const mapDispatchToProps = {
  saveQuickRoutine,
};

export default connect(mapStateToProps, mapDispatchToProps)(EndQuickRoutine);
