import {TouchableOpacity, View} from 'react-native';
import React, {ReactNode} from 'react';
import BackButton from './BackButton';
import {navigationRef} from '../../RootNavigation';

import Text from './Text';
import colors from '../../constants/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import {DrawerActions} from '@react-navigation/native';

const Header: React.FC<{
  hasBack?: boolean;
  title?: string;
  right?: ReactNode;
  left?: ReactNode;
  absolute?: boolean;
  customBackPress?: () => void;
  profile: Profile;
  showDrawerMenuButton?: boolean;
  children?: ReactNode;
}> = ({
  hasBack,
  title,
  right,
  absolute,
  customBackPress,
  profile,
  showDrawerMenuButton,
  left,
}) => {
  const insets = useSafeAreaInsets();
  const count = Object.keys(profile.unread || {}).reduce((acc, cur) => {
    if (cur !== 'plan') {
      const num = profile.unread?.[cur];
      if (num) {
        return acc + num;
      }
    }
    return acc;
  }, 0);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        position: absolute ? 'absolute' : 'relative',
        top: absolute ? insets.top : undefined,
        left: absolute ? 0 : undefined,
        zIndex: 1,
      }}>
      {hasBack && (
        <BackButton
          style={{margin: 20}}
          onPress={customBackPress || navigationRef?.goBack}
        />
      )}

      {!!left && (
        <View style={{flex: 1, alignItems: 'flex-start', margin: 20}}>
          {left}
        </View>
      )}

      {showDrawerMenuButton && (
        <TouchableOpacity
          hitSlop={{
            top: 10,
            bottom: 10,
            right: 10,
            left: 10,
          }}
          onPress={() => navigationRef.dispatch(DrawerActions.openDrawer())}
          style={{padding: 20}}>
          <Icon
            name="bars"
            color={colors.appWhite}
            size={25}
            style={{marginLeft: -3}}
          />
          {profile.premium && count > 0 && (
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                top: 7,
                right: 7,
                backgroundColor: colors.appRed,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                }}>
                {count > 9 ? '9+' : count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {!!title && (
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 25,
            fontWeight: 'bold',
          }}>
          {title}
        </Text>
      )}
      {!!right && (
        <View style={{flex: 1, alignItems: 'flex-end', margin: 20}}>
          {right}
        </View>
      )}
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Header);
