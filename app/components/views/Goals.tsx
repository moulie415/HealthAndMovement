import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from '../../styles/views/Goals';
import GoalsProps from '../../types/views/Goals';
import {Goal, Purpose} from '../../types/Shared';
import {
  Select,
  SelectItem,
  Button,
  Input,
  IndexPath,
  Layout,
  Text,
} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import {purposeItems} from '../../constants';
import DevicePixels from '../../helpers/DevicePixels';

const Goals: React.FC<GoalsProps> = ({
  selectedGoals,
  setSelectedGoals,
  workoutFrequency,
  setWorkoutFrequency,
  purpose,
  setPurpose,
  signUp,
}) => {
  const selectGoal = (goal: Goal) => {
    selectedGoals.includes(goal)
      ? setSelectedGoals(selectedGoals.filter(t => t !== goal))
      : setSelectedGoals([...selectedGoals, goal]);
  };
  const CheckIcon = ({goal}: {goal: Goal}) => {
    return selectedGoals.includes(goal) ? (
      <Icon name="check" size={DevicePixels[12]} style={{color: '#fff'}} />
    ) : null;
  };
  const CrossIcon = ({goal}: {goal: Goal}) => {
    return selectedGoals.includes(goal) ? (
      <Icon name="times" size={DevicePixels[12]} />
    ) : null;
  };
  return (
    <Layout style={{margin: DevicePixels[20]}}>
      <Text
        style={{marginTop: DevicePixels[30], marginBottom: DevicePixels[10]}}>
        What is your main purpose for using this app?
      </Text>
      <Select
        value={
          purpose
            ? purposeItems.find(item => item.purpose === purpose).title
            : ' '
        }
        onSelect={index => {
          if ('row' in index) {
            setPurpose(purposeItems[index.row].purpose);
          }
        }}
        selectedIndex={
          new IndexPath(
            purposeItems.findIndex(item => item.purpose === purpose),
          )
        }>
        {purposeItems.map(item => {
          return (
            <SelectItem
              key={item.purpose}
              selected={item.purpose === purpose}
              title={item.title}
            />
          );
        })}
      </Select>
      <Text
        style={{marginTop: DevicePixels[30], marginBottom: DevicePixels[10]}}>
        What is your main purpose for using this app?
      </Text>
      <Layout
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-evenly',
        }}>
        <Button
          size="tiny"
          accessoryLeft={() => <CheckIcon goal={Goal.STRENGTH} />}
          accessoryRight={() => <CrossIcon goal={Goal.STRENGTH} />}
          onPress={() => selectGoal(Goal.STRENGTH)}
          status={selectedGoals.includes(Goal.STRENGTH) ? 'primary' : 'basic'}
          style={{
            width: DevicePixels[120],
            marginBottom: DevicePixels[20],
          }}>
          Strength
        </Button>
        <Button
          size="tiny"
          accessoryLeft={() => <CheckIcon goal={Goal.CARDIO} />}
          accessoryRight={() => <CrossIcon goal={Goal.CARDIO} />}
          onPress={() => selectGoal(Goal.CARDIO)}
          status={selectedGoals.includes(Goal.CARDIO) ? 'primary' : 'basic'}
          style={{
            width: DevicePixels[120],
            marginBottom: DevicePixels[20],
          }}>
          Cardiovascular
        </Button>
      </Layout>
      <Text
        style={{marginTop: DevicePixels[30], marginBottom: DevicePixels[20]}}>
        How many times a week do you want to workout?
      </Text>
      <Layout
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: DevicePixels[10],
        }}>
        <TouchableOpacity
          onPress={() => {
            if (workoutFrequency > 1) {
              setWorkoutFrequency(workoutFrequency - 1);
            }
          }}>
          <Icon name="minus" color={colors.appBlue} size={DevicePixels[25]} />
        </TouchableOpacity>
        <Input
          style={{marginHorizontal: DevicePixels[10], width: DevicePixels[70]}}
          textAlign="center"
          keyboardType="numeric"
          returnKeyType="done"
          value={workoutFrequency.toString()}
          onChangeText={text => {
            if (!isNaN(Number(text))) {
              setWorkoutFrequency(Number(text.replace(/[^0-9]/g, '')));
            }
            if (!text) {
              setWorkoutFrequency(1);
            }
          }}
        />
        <TouchableOpacity
          onPress={() => setWorkoutFrequency(workoutFrequency + 1)}>
          <Icon name="plus" color={colors.appBlue} size={DevicePixels[25]} />
        </TouchableOpacity>
      </Layout>
      <Button disabled={!purpose} onPress={signUp}>
        Create Account
      </Button>
    </Layout>
  );
};

export default Goals;
