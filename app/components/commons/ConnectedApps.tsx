import {View} from 'react-native';
import React, {useState} from 'react';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import ConnectedAppsModal from './ConnectedAppsModal';
import Button from './Button';

const ConnectedApps: React.FC<{
  profile: Profile;
}> = ({profile}) => {
  const [showModal, setShowModal] = useState(false);
  const {
    garminAccessToken,
    garminAccessTokenSecret,
    polarAccessToken,
    fitbitRefreshToken,
    fitbitToken,
  } = profile;

  console.log({
    garminAccessToken,
    garminAccessTokenSecret,
    polarAccessToken,
    fitbitRefreshToken,
    fitbitToken,
  });
  return (
    <>
      <View>
        <Button text="connect" onPress={() => setShowModal(true)} />
      </View>
      <ConnectedAppsModal visible={showModal} setVisible={setShowModal} />
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ConnectedApps);
