import {View, TouchableOpacity, ImageBackground} from 'react-native';
import React from 'react';
import QuickRoutine, {Equipment} from '../../types/QuickRoutines';
import DevicePixels from '../../helpers/DevicePixels';
import {Goal, Level, MyRootState, PlanWorkout} from '../../types/Shared';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Text from './Text';
import Profile from '../../types/Profile';
import FastImage from 'react-native-fast-image';
import FastImageAnimated from './FastImageAnimated';

export const getImage = (level: Level) => {
  if (level === Level.INTERMEDIATE) {
    return require('../../images/intermediate.jpg');
  }
  if (level === Level.ADVANCED) {
    return require('../../images/advanced.jpg');
  }
  return require('../../images/beginner.jpg');
};

export const getEquipmentString = (equipment: Equipment) => {
  if (equipment === 'full') {
    return 'Full Equipment';
  }
  if (equipment === 'minimal') {
    return 'Minimal Equipment';
  }
  return 'No Equipment';
};

export const getLevelString = (level: Level) => {
  if (level === 'beginner') {
    return 'Beginner';
  }
  if (level === 'intermediate') {
    return 'Intermediate';
  }
  return 'Advanced';
};

const WorkoutCard: React.FC<{
  item: QuickRoutine | PlanWorkout;
  onPress: () => void;
  profile: Profile;
  disabled?: boolean;
}> = ({item, onPress, profile, disabled}) => {
  const locked = 'premium' in item && item.premium && !profile.premium;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      key={'id' in item ? item.id : item.name}>
      <FastImageAnimated
        style={{
          height: DevicePixels[120],
          marginHorizontal: DevicePixels[10],
          marginBottom: DevicePixels[10],
          borderRadius: DevicePixels[10],
        }}
        source={
          'thumbnail' in item && item.thumbnail
            ? {uri: item.thumbnail.src}
            : getImage('level' in item ? item.level : profile.experience)
        }>
        <View
          style={{
            height: DevicePixels[120],
            justifyContent: 'center',
            padding: DevicePixels[10],
            borderRadius: DevicePixels[10],
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          {locked ? (
            <View style={{}}>
              <Icon name="lock" color="#fff" size={DevicePixels[40]} />
            </View>
          ) : (
            <View style={{marginBottom: DevicePixels[5]}}>
              {'duration' in item ? (
                <>
                  <Text
                    style={{
                      color: colors.appWhite,
                      fontSize: DevicePixels[12],
                    }}>
                    Under
                  </Text>
                  <Text
                    style={{
                      color: colors.appWhite,
                      fontSize: DevicePixels[12],
                    }}>
                    <Text style={{fontWeight: 'bold'}}>{item.duration}</Text>
                    {' mins'}
                  </Text>
                </>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: colors.appWhite, fontWeight: 'bold'}}>
                    {item.exercises.length + ' '}
                  </Text>
                  <Text style={{color: colors.appWhite}}>
                    {item.exercises.length > 1 ? 'exercises' : 'exercise'}
                  </Text>
                </View>
              )}
            </View>
          )}
          <View
            style={{
              width: DevicePixels[250],
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: DevicePixels[16],
                fontWeight: 'bold',
                marginBottom: DevicePixels[5],
              }}>
              {item.name}
            </Text>
            {'level' in item && (
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: DevicePixels[12],
                }}>
                {`${getLevelString(item.level)} - ${getEquipmentString(
                  item.equipment,
                )}`}
              </Text>
            )}
          </View>
        </View>
      </FastImageAnimated>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(WorkoutCard);
