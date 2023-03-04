import React, {useMemo} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
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
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import Exercise from '../../../types/Exercise';
import {getEquipmentList} from '../../../helpers/exercises';

const PreQuickRoutine: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'PreQuickRoutine'>;
  route: RouteProp<StackParamList, 'PreQuickRoutine'>;
  exercisesObj: {[key: string]: Exercise};
}> = ({route, navigation, exercisesObj}) => {
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
    },
  } = route.params;
  const exercises = useMemo(() => {
    return exerciseIds.map(id => {
      return exercisesObj[id];
    });
  }, [exercisesObj, exerciseIds]);

  const equipmentList = getEquipmentList(exercises);

  return (
    <>
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
          <Text style={{color: colors.appWhite}}>{`${exerciseIds.length} ${
            exerciseIds.length > 1 ? 'exercises' : 'exercise'
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
              name="tachometer-alt"
              size={22}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite}}>
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
          <Text style={{color: colors.appWhite}}>
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
          <Text style={{color: colors.appWhite}}>{`${capitalizeFirstLetter(
            area,
          )} body`}</Text>
        </View>
        <Button
          style={{margin: 15}}
          text="Start workout"
          onPress={() =>
            navigation.navigate('QuickRoutine', {routine: route.params.routine})
          }
        />
      </ScrollView>
    </>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  exercisesObj: exercises.exercises,
});

export default connect(mapStateToProps)(PreQuickRoutine);
