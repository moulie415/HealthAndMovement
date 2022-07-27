import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';

const Medications: React.FC<{
  medications: string;
  setMedications: (medications: string) => void;
}> = ({medications, setMedications}) => {
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
            fontSize: DevicePixels[20],
            color: colors.appWhite,
          }}>
          Medications?
        </Text>
        <Input
          placeholder="List relevant medications... (optional)"
          style={{height: DevicePixels[100], textAlignVertical: 'top'}}
          multiline
          onChangeText={setMedications}
          value={medications}
          placeholderTextColor={colors.appWhite}
        />
      </View>
    </ImageBackground>
  );
};

export default Medications;
