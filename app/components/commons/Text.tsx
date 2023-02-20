import React from 'react';
import {Text as RNText, TextProps} from 'react-native';

const Text: React.FC<TextProps> = ({children, ...props}) => {
  return (
    <RNText {...props} style={[{fontFamily: 'Helvetica'}, props.style]}>
      {children}
    </RNText>
  );
};

export default Text;
