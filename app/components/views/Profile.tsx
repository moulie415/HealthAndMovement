import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  View,
  Alert,
  Platform,
} from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {connect} from 'react-redux';
import {MyRootState, UpdateProfilePayload} from '../../types/Shared';
import colors from '../../constants/colors';
import Profile, {Gender} from '../../types/Profile';
import * as _ from 'lodash';
import {
  BONE_DENSITIES,
  HEIGHTS,
  MUSCLE_MASSES,
  PERCENTAGES,
  WEIGHTS,
} from '../../constants';

import Avatar from '../commons/Avatar';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import AbsoluteSpinner from '../commons/AbsoluteSpinner';
import {logError} from '../../helpers/error';
import storage from '@react-native-firebase/storage';
import Text from '../commons/Text';
import Button from '../commons/Button';
import Header from '../commons/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import PickerModal from '../commons/PickerModal';
import ProfileCharts from '../commons/ProfileCharts';
import {StackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Tile from '../commons/Tile';
import Modal from '../commons/Modal';
import GoalSummaries from '../commons/GoalSummaries';
import {AlertButton} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import {getSamples, updateProfile} from '../../reducers/profile';
import {SettingsState} from '../../reducers/settings';

const ProfileComponent: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Profile'>;
  profile: Profile;
  updateProfileAction: (payload: UpdateProfilePayload) => void;
  getSamplesAction: () => void;
  loading: boolean;
  settings: SettingsState;
}> = ({
  profile,
  navigation,
  updateProfileAction,
  getSamplesAction,
  loading: pLoading,
  settings,
}) => {
  const [gender, setGender] = useState<Gender>(
    (profile.gender as Gender) || null,
  );
  const [weight, setWeight] = useState<number>(profile.weight || 0);
  const [dob, setDob] = useState(profile.dob);
  const [height, setHeight] = useState<number>(profile.height || 0);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showDobModal, setShowDobModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showBodyFatPercentageModal, setShowBodyFatPercentageModal] =
    useState(false);
  const [bodyFatPercentage, setBodyFatPercentage] = useState(
    profile.bodyFatPercentage,
  );

  const [showMuscleMassModal, setShowMuscleMassModal] = useState(false);
  const [muscleMass, setMuscleMass] = useState(profile.muscleMass);

  const [showBoneMassModal, setShowBoneMassModal] = useState(false);
  const [boneMass, setBoneMass] = useState(profile.boneMass);

  const [images, setImages] = useState<ImageSource[]>([]);
  const [photoVisible, setPhotoVisible] = useState(false);

  const [newProfile, setNewProfile] = useState<Profile>({
    ...profile,
    gender,
    weight,
    dob,
    height,
    ...(avatar !== undefined ? {avatar} : {}),
    ...(bodyFatPercentage !== undefined ? {bodyFatPercentage} : {}),
    ...(muscleMass !== undefined ? {muscleMass} : {}),
    ...(boneMass !== undefined ? {boneMass} : {}),
  });

  const equal = _.isEqual(newProfile, profile);

  const handlePickerCallback = useCallback(
    async (response: ImagePickerResponse) => {
      if (response.errorMessage || response.errorCode) {
        Snackbar.show({
          text: `Error: ${response.errorMessage || response.errorCode}`,
        });
      } else if (!response.didCancel) {
        const image = response.assets?.[0];
        setAvatar(image?.uri);
      }
    },
    [],
  );

  useEffect(() => {
    setNewProfile({
      ...profile,
      gender,
      weight,
      dob,
      height,
      ...(avatar !== undefined ? {avatar} : {}),
      ...(bodyFatPercentage !== undefined ? {bodyFatPercentage} : {}),
      ...(muscleMass !== undefined ? {muscleMass} : {}),
      ...(boneMass !== undefined ? {boneMass} : {}),
    });
  }, [
    profile,
    gender,
    weight,
    dob,
    height,
    avatar,
    bodyFatPercentage,
    muscleMass,
    boneMass,
  ]);

  const onSave = async () => {
    try {
      setLoading(true);
      let newAvatar = profile.avatar;
      if (avatar !== profile.avatar) {
        const imageRef = storage().ref(`images/${profile.uid}`).child('avatar');
        await imageRef.putFile(avatar || '');
        newAvatar = await imageRef.getDownloadURL();
      }
      setAvatar(newAvatar);
      updateProfileAction({
        gender,
        dob,
        height,
        weight,
        ...(newAvatar !== undefined ? {avatar: newAvatar} : {}),
        ...(bodyFatPercentage !== undefined ? {bodyFatPercentage} : {}),
        ...(muscleMass !== undefined ? {muscleMass} : {}),
        ...(boneMass !== undefined ? {boneMass} : {}),
      });
    } catch (e) {
      logError(e);
      Snackbar.show({text: 'Error updating profile'});
    }
    setLoading(false);
  };

  useEffect(() => {
    getSamplesAction();
  }, [getSamplesAction]);

  useEffect(() => {
    if (profile.avatar) {
      setImages([{uri: profile.avatar}]);
    }
  }, [profile.avatar]);

  const saveDisabled = !dob || equal || pLoading || loading;

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header
          left={
            <TouchableOpacity
              disabled={equal || loading || pLoading}
              onPress={() => {
                setAvatar(profile.avatar);
                setWeight(profile.weight || 0);
                setHeight(profile.height || 0);
                setBoneMass(profile.boneMass);
                setMuscleMass(profile.muscleMass);
                setBodyFatPercentage(profile.bodyFatPercentage);
                setDob(profile.dob);
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  opacity: equal ? 0.5 : 1,
                }}>
                UNDO
              </Text>
            </TouchableOpacity>
          }
          right={
            <TouchableOpacity
              disabled={saveDisabled}
              onPress={() => {
                onSave();
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  opacity: saveDisabled ? 0.5 : 1,
                }}>
                SAVE
              </Text>
            </TouchableOpacity>
          }
        />
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{paddingBottom: 100}}>
          <View
            style={{
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                if (profile.premium) {
                  const MAX_SIZE = 500;
                  const cameraOptions: CameraOptions = {
                    mediaType: 'photo',
                    maxHeight: MAX_SIZE,
                    maxWidth: MAX_SIZE,
                  };
                  const imageLibraryOptions: ImageLibraryOptions = {
                    mediaType: 'photo',
                    maxHeight: MAX_SIZE,
                    maxWidth: MAX_SIZE,
                  };
                  const options: AlertButton[] = [
                    {
                      text: 'Upload from image library',
                      onPress: () =>
                        launchImageLibrary(cameraOptions, handlePickerCallback),
                    },
                    {
                      text: 'Take photo',
                      onPress: () =>
                        launchCamera(imageLibraryOptions, handlePickerCallback),
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                  ];
                  if (profile.avatar) {
                    options.splice(2, 0, {
                      text: 'View photo',
                      onPress: () => setPhotoVisible(true),
                    });
                  }
                  Alert.alert('Profile photo', '', options);
                } else {
                  navigation.navigate('Premium', {});
                }
              }}
              style={{
                width: 95,
                height: 95,
                borderRadius: 48,
                borderColor: colors.appWhite,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Avatar
                name={`${profile.name} ${profile.surname || ''}`}
                src={avatar}
                size={80}
                uid={profile.uid}
                hideCheck
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: colors.appWhite,
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  size={15}
                  name={profile.premium ? 'pencil-alt' : 'lock'}
                  color={colors.appBlue}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.appWhite,
                textAlign: 'center',
              }}>
              {`${profile.name} ${profile.surname || ''}`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowWeightModal(true)}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}>
                {weight}
                <Text style={{fontSize: 12}}> kg</Text>
              </Text>
              <Text style={{fontSize: 12, color: colors.appWhite}}>Weight</Text>
            </Tile>
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowHeightModal(true)}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}>
                {height}
                <Text style={{fontSize: 12}}> cm</Text>
              </Text>
              <Text style={{fontSize: 12, color: colors.appWhite}}>Height</Text>
            </Tile>
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowDobModal(true)}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}>
                {moment().diff(dob, 'years')}
                <Text style={{fontSize: 12}}> y.o</Text>
              </Text>
              <Text style={{fontSize: 12, color: colors.appWhite}}>Age</Text>
            </Tile>
          </View>

          <GoalSummaries />

          <ProfileCharts
            weight={weight}
            height={height}
            bodyFatPercentage={bodyFatPercentage}
            muscleMass={muscleMass}
            boneMass={boneMass}
            setShowBodyFatPercentageModal={setShowBodyFatPercentageModal}
            setShowBoneMassModal={setShowBoneMassModal}
            setShowMuscleMassModal={setShowMuscleMassModal}
            setShowHeightModal={setShowHeightModal}
            setShowWeightModal={setShowWeightModal}
          />

          <Button
            variant="danger"
            text=" Delete my account"
            style={{margin: 20}}
            onPress={() => navigation.navigate('DeleteAccount')}
          />
        </ScrollView>

        <PickerModal
          title="Select height"
          visible={showHeightModal}
          selectedValue={String(height)}
          pickerData={HEIGHTS.map(value => {
            return {
              label: `${value.toString()} cm`,
              value: String(value),
            };
          })}
          onValueChange={val => setHeight(Number(val))}
          onRequestClose={() => setShowHeightModal(false)}
        />
        <PickerModal
          title="Select weight"
          visible={showWeightModal}
          selectedValue={String(weight)}
          pickerData={WEIGHTS.map(value => {
            return {
              label: `${value.toString()} kg`,
              value: String(value),
            };
          })}
          onValueChange={val => setWeight(Number(val))}
          onRequestClose={() => setShowWeightModal(false)}
        />
        <PickerModal
          title="Select body fat percentage"
          visible={showBodyFatPercentageModal}
          selectedValue={String(bodyFatPercentage)}
          pickerData={PERCENTAGES.map(value => {
            return {
              label: `${value.toString()} %`,
              value: String(value),
            };
          })}
          onValueChange={val => setBodyFatPercentage(Number(val))}
          onRequestClose={() => setShowBodyFatPercentageModal(false)}
        />
        <PickerModal
          title="Select muscle mass"
          visible={showMuscleMassModal}
          selectedValue={String(muscleMass)}
          pickerData={MUSCLE_MASSES.map(value => {
            return {
              label: `${value.toString()} kg`,
              value: String(value),
            };
          })}
          onValueChange={val => setMuscleMass(Number(val))}
          onRequestClose={() => setShowMuscleMassModal(false)}
        />
        <PickerModal
          title="Select bone mass"
          visible={showBoneMassModal}
          selectedValue={String(boneMass)}
          pickerData={BONE_DENSITIES.map(value => {
            return {
              label: `${value.toString()} kg`,
              value: String(value),
            };
          })}
          onValueChange={val => setBoneMass(Number(val))}
          onRequestClose={() => setShowBoneMassModal(false)}
        />
        <Modal
          visible={showDobModal && Platform.OS === 'ios'}
          onRequestClose={() => setShowDobModal(false)}>
          <View
            style={{
              backgroundColor: colors.appGrey,
              width: '90%',
              alignSelf: 'center',
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: colors.appWhite,
                padding: 20,
                paddingBottom: 10,
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Select date
            </Text>
            <View style={{paddingHorizontal: 20}}>
              <DatePicker
                mode="date"
                textColor={colors.appWhite}
                maximumDate={moment().subtract(18, 'years').toDate()}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                value={moment(dob).toDate()}
                onChange={(event, d: Date | undefined) => {
                  setShowDobModal(true);
                  setDob(d ? d.toISOString() : dob);
                }}
              />
            </View>

            <Button
              text="Close"
              style={{margin: 10}}
              onPress={() => setShowDobModal(false)}
            />
          </View>
        </Modal>
        {showDobModal && Platform.OS === 'android' && (
          <DatePicker
            mode="date"
            style={{}}
            textColor={colors.appWhite}
            maximumDate={moment().subtract(18, 'years').toDate()}
            display={'default'}
            value={moment(dob).toDate()}
            onChange={(event, d: Date | undefined) => {
              setShowDobModal(false);
              setDob(d ? d.toISOString() : dob);
            }}
          />
        )}
      </SafeAreaView>
      <ImageView
        images={images}
        imageIndex={0}
        visible={photoVisible}
        onRequestClose={() => setPhotoVisible(false)}
      />
    </View>
  );
};

const mapStateToProps = ({profile, settings}: MyRootState) => ({
  profile: profile.profile,
  loading: profile.loading,
  settings,
});

const mapDispatchToProps = {
  updateProfileAction: updateProfile,
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent);
