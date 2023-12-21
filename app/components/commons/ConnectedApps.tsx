import {TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import ConnectedAppsModal from './ConnectedAppsModal';
import Button from './Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import Text from './Text';
import LinearGradient from 'react-native-linear-gradient';
import {navigate} from '../../RootNavigation';
import { setProfile } from '../../reducers/profile';

const ConnectedApps: React.FC<{
  profile: Profile;
  setProfile: (profile: Profile) => void;
}> = ({profile, setProfile: setProfileAction}) => {
  const [showModal, setShowModal] = useState(false);
  const connected: string[] = useMemo(() => {
    const arr = [];
    if (profile.garminAccessToken) {
      arr.push('Garmin');
    }
    if (profile.polarAccessToken) {
      arr.push('Polar');
    }
    if (profile.fitbitToken) {
      arr.push('Fitbit');
    }
    return arr;
  }, [
    profile.garminAccessToken,
    profile.polarAccessToken,
    profile.fitbitToken,
  ]);
  const onPress = () => {
    if (profile.premium) {
      setShowModal(true);
    } else {
      navigate('Premium', {});
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
          marginBottom: 20,
        }}>
        <View style={{width: 55, alignItems: 'center'}}>
          <Icon
            name="mobile"
            size={25}
            color={colors.appWhite}
            style={{
              marginHorizontal: 15,
            }}
          />
        </View>
        <Text style={{color: colors.appWhite, flex: 1}}>
          {`Connected apps: ${
            connected.length ? connected.join(', ') : 'none'
          }`}
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={{
            overflow: 'hidden',
            marginRight: 15,
            position: 'absolute',
            right: 0,
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.appBlue,
          }}>
          <Icon name="cog" size={25} color={colors.appWhite} style={{}} />
        </TouchableOpacity>
      </TouchableOpacity>
      <ConnectedAppsModal visible={showModal} setVisible={setShowModal} />
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedApps);
