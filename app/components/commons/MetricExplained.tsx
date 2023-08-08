import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Modal from './Modal';
import Button from './Button';

import colors from '../../constants/colors';
import Text from './Text';
import * as _ from 'lodash';
import Tile from './Tile';
import {Dimensions} from 'react-native';

const MetricExplained: React.FC<{
  suffix?: string;
  ranges: number[];
  colors: string[];
  labels: string[];
  current?: number;
  onPress?: () => void;
  onPressViewHistorical: () => void;
  title: string;
}> = ({
  ranges,
  colors: colorsArr,
  title,
  labels,
  current = 0,
  suffix,
  onPress,
  onPressViewHistorical,
}) => {
  return (
    <Tile
      onPress={onPress}
      style={{
        width: Dimensions.get('window').width - 40,
        marginBottom: 20,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
        <TouchableOpacity
          onPress={onPressViewHistorical}
          style={{
            paddingHorizontal: 10,

            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.appWhite,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            height: 30,
            margin: 10,
          }}>
          <Text style={{color: colors.appWhite, fontSize: 12}}>
            View historical
          </Text>
        </TouchableOpacity>
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
              (current >= currentRange && current < nextRange) ||
              (isLast && current > nextRange);

            const diff = nextRange - currentRange;
            const val = current - currentRange;
            const percentage = _.clamp((val / diff) * 100, 100);
            return (
              <View key={color} style={{flex: 1}}>
                <Text
                  style={{
                    textAlign: 'left',
                    color: colors.appWhite,
                    marginLeft: -10,
                    height: 23,
                  }}>
                  {isFirst ? '' : `${ranges[index] + (suffix as string) || ''}`}
                </Text>
                <View
                  style={{
                    backgroundColor: color,
                    height: 7,
                    justifyContent: 'center',
                  }}>
                  {isInRange && !!current && (
                    <View
                      style={{
                        height: 15,
                        width: 15,
                        backgroundColor: colors.appWhite,
                        borderRadius: 8,
                        left: `${percentage}%`,
                        marginLeft: -8,
                        borderWidth: 2,
                        borderColor: color,
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 9,
                    marginTop: 10,
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
    </Tile>
  );
};

export default MetricExplained;
