import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';

const Occupation: React.FC<{
  occupation: string;
  setOccupation: (occupation: string) => void;
}> = ({occupation, setOccupation}) => {
  return (
    <ImageBackground
      source={require('../../../images/login.jpeg')}
      blurRadius={5}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.appBlack,
          opacity: 0.5,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          margin: DevicePixels[50],
        }}>
        <Text
          style={{
            textAlign: 'center',
            marginVertical: DevicePixels[20],
            width: DevicePixels[250],
            color: colors.appWhite,
            fontSize: DevicePixels[20],
          }}>
          Occupation?
        </Text>

        <Input
          placeholder="e.g. Doctor, lawyer..."
          value={occupation}
          onChangeText={setOccupation}
        />
      </View>
    </ImageBackground>
  );
};

export default Occupation;
