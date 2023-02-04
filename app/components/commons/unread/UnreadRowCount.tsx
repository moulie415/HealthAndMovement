import React from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';

import {View} from 'react-native';
import Text from '../Text';

const UnreadRowCount: React.FC<{
  unread: {[key: string]: number} | undefined;
}> = ({unread}) => {
  const count = Object.values(unread || {}).reduce((acc, cur) => acc + cur, 0);
  if (count > 0) {
    return (
      <View
        style={{
          marginLeft: 5,
          width: 25,
          height: 25,
          borderRadius: 13,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.appRed,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.appWhite,
          }}>
          {count > 9 ? '9+' : count}
        </Text>
      </View>
    );
  }
  return null;
};

const mapStateToProps = ({profile}: MyRootState) => ({
  unread: profile.profile.unread,
});

export default connect(mapStateToProps)(UnreadRowCount);
