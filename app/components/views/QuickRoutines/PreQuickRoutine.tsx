import React, {useEffect, useMemo, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {capitalizeFirstLetter, getVideoHeight} from '../../../helpers';
import Header from '../../commons/Header';
import Button from '../../commons/Button';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Dimensions, StyleSheet, View} from 'react-native';
import {MyRootState, UpdateProfilePayload} from '../../../types/Shared';
import {connect} from 'react-redux';
import Exercise from '../../../types/Exercise';
import {getEquipmentList} from '../../../helpers/exercises';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import Spinner from '../../commons/Spinner';
import ConnectedApps from '../../commons/ConnectedApps';
import Toggle from '../../commons/Toggle';
import {updateProfile} from '../../../reducers/profile';

const PreQuickRoutine: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'PreQuickRoutine'>;
  route: RouteProp<StackParamList, 'PreQuickRoutine'>;
  exercisesObj: {[key: string]: Exercise};
  workoutMusic?: boolean;
  updateProfile: (payload: UpdateProfilePayload) => void;
}> = ({
  route,
  navigation,
  exercisesObj,
  workoutMusic,
  updateProfile: updateProfileAction,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    routine: {
      name,
      thumbnail,
      area,
      duration,
      equipment,
      level,
      exerciseIds,
      instructions,
      preview,
    },
  } = route.params;
  const exercises = useMemo(() => {
    return exerciseIds.map(id => {
      return exercisesObj[id];
    });
  }, [exercisesObj, exerciseIds]);

  const equipmentList = getEquipmentList(exercises);

  const [paused, setPaused] = useState(false);
  const focused = useIsFocused();

  const setWorkoutMusic = (wm: boolean) =>
    updateProfileAction({workoutMusic: wm});

  useEffect(() => {
    if (focused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [focused]);

  return (
    <>
      {preview?.src ? (
        <>
          <Video
            source={{uri: convertToProxyURL(preview.src)}}
            style={{height: getVideoHeight(), width: '100%'}}
            resizeMode={'cover'}
            onLoad={() => setLoading(false)}
            onLoadStart={() => setLoading(true)}
            repeat
            disableFocus
            paused={paused}
          />
          {loading && (
            <Spinner
              style={{
                position: 'absolute',
                left: '45%',
                top: getVideoHeight() / 2,
              }}
            />
          )}
          <Header absolute hasBack />
        </>
      ) : (
        <FastImage
          source={{uri: thumbnail?.src}}
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
      )}

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
          {name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="stopwatch"
              size={25}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text
            style={{color: colors.appWhite}}>{`Under ${duration} mins`}</Text>
        </View>
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
          <Text style={{color: colors.appWhite, flex: 1}}>{`${
            exerciseIds.length
          } ${exerciseIds.length > 1 ? 'exercises' : 'exercise'} `}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="tachometer-alt"
              size={22}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite, flex: 1}}>
            {capitalizeFirstLetter(level)}
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
              ? `${capitalizeFirstLetter(
                  equipment,
                )} equipment (${equipmentList.join(', ')})`
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
          <Text
            style={{color: colors.appWhite, flex: 1}}>{`${capitalizeFirstLetter(
            area,
          )} body`}</Text>
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
          text="Let's go!"
          onPress={() =>
            navigation.navigate('QuickRoutine', {
              routine: route.params.routine,
              startTime: new Date(),
            })
          }
        />
      </ScrollView>
    </>
  );
};

const mapStateToProps = ({exercises, profile}: MyRootState) => ({
  exercisesObj: exercises.exercises,
  workoutMusic: profile.profile.workoutMusic,
});

const mapDispatchToProps = {
  updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(PreQuickRoutine);
