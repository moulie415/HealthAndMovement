import {View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import Input from '../../commons/Input';

const GeneralLifestyle: React.FC<{
  lifestyle: string;
  setLifestyle: (lifestyle: string) => void;
}> = ({lifestyle, setLifestyle}) => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appWhite,
        }}>
        General lifestyle?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <Input
          placeholder="e.g. active, sedentary, mixed"
          textStyle={{height: DevicePixels[100], textAlignVertical: 'top'}}
          multiline
          onChangeText={setLifestyle}
          value={lifestyle}
        />
      </View>
    </View>
  );
};

export default GeneralLifestyle;
