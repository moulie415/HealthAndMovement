import React from 'react';
import colors from '../../constants/colors';
import {
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Text from './Text';
import DevicePixels from '../../helpers/DevicePixels';
import Spinner from './Spinner';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props extends TouchableOpacityProps {
  text: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  textStyle?: TextStyle;
}

const Button: React.FC<Props> = ({
  text,
  loading,
  variant,
  textStyle,
  disabled,
  ...props
}) => {
  const getColor = () => {
    if (disabled) {
      return colors.textGrey;
    }
    if (variant === 'secondary') {
      return colors.appWhite;
    }
    if (variant === 'danger') {
      return colors.appRed;
    }
    return colors.textGrey;
  };
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={[
        {
          borderRadius: DevicePixels[10],
          overflow: 'hidden',
          height: DevicePixels[60],
          justifyContent: 'center',
          padding: DevicePixels[10],
          backgroundColor: getColor(),
          opacity: disabled ? 0.5 : 1,
        },
        props.style,
      ]}>
      {loading ? (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Spinner />
        </View>
      ) : (
        <Text
          style={[
            {
              color: variant === 'secondary' ? colors.appGrey : colors.appWhite,
              textAlign: 'center',
              fontSize: DevicePixels[20],
            },
            textStyle,
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
