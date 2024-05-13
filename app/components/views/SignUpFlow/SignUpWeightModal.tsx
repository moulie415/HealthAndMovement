import React from 'react';
import {Dimensions, View} from 'react-native';
import {RulerPicker} from 'react-native-ruler-picker';
import colors from '../../../constants/colors';
import Button from '../../commons/Button';
import Modal from '../../commons/Modal';
import Text from '../../commons/Text';

const windowWidth = Dimensions.get('window').width;

const SignUpWeightModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  weight: number;
  setWeight: (val: number) => void;
}> = ({visible, onRequestClose, weight, setWeight}) => {
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: windowWidth * 0.9,
          alignSelf: 'center',
          borderRadius: 10,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            padding: 20,
            paddingBottom: 40,
            fontSize: 20,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Select weight
        </Text>

        <RulerPicker
          height={150}
          min={0}
          max={500}
          step={0.1}
          fractionDigits={1}
          width={windowWidth * 0.9}
          initialValue={weight ? weight + 0.1 : 80}
          unitTextStyle={{color: colors.appWhite}}
          valueTextStyle={{color: colors.appWhite}}
          onValueChangeEnd={number => setWeight(Number(number))}
          unit="kg"
          indicatorColor={colors.appBlue}
        />
        <Button text="Close" style={{margin: 10}} onPress={onRequestClose} />
      </View>
    </Modal>
  );
};

export default SignUpWeightModal;
