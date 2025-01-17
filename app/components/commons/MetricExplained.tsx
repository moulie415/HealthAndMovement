import * as _ from 'lodash';
import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import {navigate} from '../../RootNavigation';
import colors from '../../constants/colors';
import {Profile} from '../../types/Shared';
import Text from './Text';
import Tile from './Tile';

const MetricExplained: React.FC<{
  suffix?: string;
  ranges: number[];
  colors: string[];
  labels: string[];
  current?: number;
  onPress?: () => void;
  onPressHistorical: () => void;
  title: string;
  connection?: boolean;
  premium?: boolean;
  profile: Profile;
}> = ({
  ranges,
  colors: colorsArr,
  title,
  labels,
  current = 0,
  suffix,
  onPress,
  onPressHistorical,
  connection,
  premium,
  profile,
}) => {
  const needsPremium = premium && !profile.premium && !profile.freeBiometrics;
  return (
    <Tile
      style={{
        width: Dimensions.get('window').width - 40,
        marginBottom: 20,
      }}>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Text
          style={{
            textAlign: 'left',
            padding: 15,
            fontSize: 18,
            color: colors.appWhite,
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
        {!connection && (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={onPressHistorical}
              style={{
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.appWhite,
                margin: 10,
                paddingHorizontal: 10,
                height: 30,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="chart-line" color={colors.appWhite} size={16} />
            </TouchableOpacity>
            {onPress && (
              <TouchableOpacity
                onPress={() => {
                  if (needsPremium) {
                    navigate('Premium', {});
                  } else {
                    onPress();
                  }
                }}
                style={{
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.appWhite,
                  margin: 10,
                  marginLeft: 0,
                  paddingHorizontal: 10,
                  height: 30,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="pencil" color={colors.appWhite} size={16} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 10,
          marginBottom: 20,
        }}>
        {!!colorsArr.length &&
          !!ranges.length &&
          colorsArr.map((color, index) => {
            const isFirst = index === 0;
            const isLast = index === colorsArr.length - 1;
            const currentRange = ranges[index];
            const nextRange = ranges[index + 1];
            const isInRange =
              (current >= currentRange && current <= nextRange) ||
              (isLast && current >= nextRange);

            const diff = nextRange - currentRange;
            const val = current - currentRange;
            const percentage = _.clamp((val / diff) * 100, 100);

            return (
              <View
                key={color + ranges[index]}
                style={{flex: 1, zIndex: -index}}>
                <Text
                  style={{
                    textAlign: 'left',
                    color: colors.appWhite,
                    marginLeft: -10,
                    height: 23,
                  }}>
                  {isFirst
                    ? ''
                    : `${ranges[index] + ((suffix || '') as string) || ''}`}
                </Text>
                <View
                  style={{
                    backgroundColor: color,
                    height: 7,
                    justifyContent: 'center',
                  }}
                />
                {isInRange && !!current && (
                  <View
                    style={{
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      left: `${percentage}%`,
                      marginTop: -7,
                    }}>
                    <View
                      style={{
                        height: 15,
                        width: 15,
                        backgroundColor: colors.appWhite,
                        borderRadius: 8,

                        marginLeft: -8,
                        borderWidth: 2,
                        borderColor: color,
                      }}
                    />
                    <Text
                      style={{
                        color: colors.appWhite,
                        marginLeft: current > 9 ? -7 : -4,
                        fontSize: 10,
                        fontWeight: 'bold',
                        position: 'absolute',
                        bottom: 10,
                      }}>
                      {current}
                    </Text>
                  </View>
                )}

                <Text
                  style={{
                    fontSize: 9,
                    marginTop: 25,
                    color: colors.appWhite,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  {labels[index]}
                </Text>
              </View>
            );
          })}
      </View>
      {needsPremium && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigate('Premium', {})}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="lock" color={colors.appWhite} size={30} />
        </TouchableOpacity>
      )}
    </Tile>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(MetricExplained);
