import {View, Text, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import FastImage from 'react-native-fast-image';
import {capitalizeFirstLetter, getVideoHeight} from '../../../helpers';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import {ScrollView} from 'react-native-gesture-handler';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Button from '../../commons/Button';
import {MyRootState, UpdateProfilePayload} from '../../../types/Shared';
import {connect} from 'react-redux';
import Exercise from '../../../types/Exercise';
import {getEquipmentList, getMusclesList} from '../../../helpers/exercises';
import ConnectedApps from '../../commons/ConnectedApps';
import Toggle from '../../commons/Toggle';
import {updateProfile} from '../../../reducers/profile';

const PreWorkout: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'PreWorkout'>;
  route: RouteProp<StackParamList, 'PreWorkout'>;
  workout: Exercise[];
  workoutMusic?: boolean;
  updateProfile: (payload: UpdateProfilePayload) => void;
}> = ({
  route,
  navigation,
  workout,
  workoutMusic,
  updateProfile: updateProfileAction,
}) => {
  const {planWorkout, planId} = route.params;

  const equipmentList = getEquipmentList(workout);
  const musclesList = getMusclesList(workout);

  const setWorkoutMusic = (music: boolean) =>
    updateProfileAction({workoutMusic: music});

  return (
    <>
      <FastImage
        source={require('../../../images/new_workout.jpeg')}
        style={{height: getVideoHeight()}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.5,
          }}
        />
        <SafeAreaView>
          <Header hasBack />
        </SafeAreaView>
      </FastImage>
      <ScrollView
        style={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -30,
          backgroundColor: colors.appGrey,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: colors.appWhite,
            textAlign: 'center',
            marginTop: 30,
            marginBottom: 10,
            fontSize: 20,
          }}>
          {planWorkout.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="running"
              size={25}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite}}>{`${workout.length} ${
            workout.length > 1 ? 'exercises' : 'exercise'
          } `}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="dumbbell"
              size={20}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite, flex: 1}}>
            {equipmentList && equipmentList.length
              ? equipmentList.join(', ')
              : 'No equipment needed'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="child"
              size={25}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite, flex: 1}}>
            {musclesList && musclesList.length ? musclesList.join(', ') : ''}
          </Text>
        </View>
        {/* <ConnectedApps /> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="music"
              size={25}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite, flex: 1}}>Workout music</Text>
          <Toggle
            style={{marginRight: 20}}
            value={workoutMusic}
            onValueChange={setWorkoutMusic}
          />
        </View>
        <Button
          style={{margin: 15}}
          text="Start workout"
          onPress={() =>
            navigation.navigate('StartWorkout', {
              planWorkout,
              startTime: new Date(),
              planId,
            })
          }
        />
      </ScrollView>
    </>
  );
};

const mapStateToProps = ({exercises, profile}: MyRootState) => ({
  workout: exercises.workout,
  workoutMusic: profile.profile.workoutMusic,
});

const mapDispatchToProps = {
  updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(PreWorkout);
