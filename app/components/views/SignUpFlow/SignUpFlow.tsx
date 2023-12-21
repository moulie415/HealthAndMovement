import React, {useRef, useState} from 'react';
import {
  Alert,
  Platform,
  Dimensions,
  SafeAreaView,
  View,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import Profile, {Gender} from '../../../types/Profile';
import {Goal, Level, MyRootState, SignUpPayload} from '../../../types/Shared';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import {
  getDateOfBirth,
  getHeight,
  getSex,
  getWeight,
  initBiometrics,
  isAvailable,
  linkToGoogleFit,
} from '../../../helpers/biometrics';
import {logError} from '../../../helpers/error';
import useInit from '../../../hooks/UseInit';
import SelectGoal from './SelectGoal';
import Header from '../../commons/Header';
import Goals from './Goals';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import moment from 'moment';
import PersonalDetails from './PersonalDetails';
import SelectArea from './SelectArea';
import Button from '../../commons/Button';
import StepIndicator from 'react-native-step-indicator';
import useThrottle from '../../../hooks/UseThrottle';
import {Area, Equipment} from '../../../types/QuickRoutines';
import SelectEquipment from './SelectEquipment';
import SelectExperience from './SelectExperience';
import {signUp} from '../../../reducers/profile';

const {width} = Dimensions.get('window');

const SignUpFlow: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'SignUpFlow'>;
  route: RouteProp<StackParamList, 'SignUpFlow'>;
  profile: Profile;
  signUp: (payload: SignUpPayload) => void;
}> = ({navigation, route, profile, signUp: signUpAction}) => {
  const fromProfile = route.params?.fromProfile;
  const [name, setName] = useState(profile.name || '');
  const [surname, setSurname] = useState(profile.surname || '');
  const [dob, setDob] = useState(profile.dob || new Date().toISOString());
  const [weight, setWeight] = useState<number>(profile.weight || 0);

  const [marketing, setMarketing] = useState(profile.marketing || false);
  const [height, setHeight] = useState<number>((profile.height as number) || 0);
  const [gender, setGender] = useState<Gender>(
    (profile.gender as Gender) || 'none',
  );
  const [goal, setGoal] = useState<Goal>((profile.goal as Goal) || null);
  const [area, setArea] = useState<Area>((profile.area as Area) || null);
  const [equipment, setEquipment] = useState<Equipment>(
    (profile.equipment as Equipment) || null,
  );
  const [experience, setExperience] = useState<Level>(
    (profile.experience as Level) || null,
  );
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  useInit(() => {
    const setup = async () => {
      setLoading(true);
      const available = await isAvailable();
      if (!available && Platform.OS === 'android') {
        Alert.alert(
          'Google Fit not installed',
          'While not required we recommend you install Google Fit to get the most out of CA Health',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Install Google Fit', onPress: linkToGoogleFit},
          ],
        );
        setLoading(false);
      } else if (available) {
        const fetchData = async () => {
          try {
            await initBiometrics();
            const h = await getHeight();
            setHeight(h as number);
            const w = await getWeight();
            setWeight(w as number);
            const sex = await getSex();
            if (sex === 'male' || sex === 'female') {
              setGender(sex);
            }
            const dateOfBirth = await getDateOfBirth();
            if (dateOfBirth) {
              setDob(dateOfBirth);
            }
            setLoading(false);
          } catch (e) {
            setLoading(false);
            logError(e);
          }
        };
        fetchData();
      }
      setLoading(false);
    };
    setup();
  });

  const completeSignUp = useThrottle(() => {
    setLoading(true);
    signUpAction({
      name,
      surname,
      dob,
      weight,
      height,
      gender,
      goal,
      marketing,
      area,
      experience,
      equipment,
      fromProfile: !!fromProfile,
    });
  }, 3000);

  const [index, setIndex] = useState(0);

  const ref = useRef<PagerView>(null);

  const goNext = () => ref.current?.setPage(index + 1);
  const goBack = () => ref.current?.setPage(index - 1);

  const slides = [
    {
      showNext:
        !!name &&
        !!surname &&
        !!dob &&
        moment().diff(dob, 'years') >= 18 &&
        !!height &&
        !!weight &&
        !!privacy,
      key: 'name',
      component: (
        <PersonalDetails
          name={name}
          surname={surname}
          setName={setName}
          setSurname={setSurname}
          setDob={setDob}
          dob={dob}
          height={height}
          weight={weight}
          setWeight={setWeight}
          setHeight={setHeight}
          privacy={privacy}
          setPrivacy={setPrivacy}
          marketing={marketing}
          setMarketing={setMarketing}
          gender={gender}
          setGender={setGender}
        />
      ),
    },
    {
      key: 'goal',
      showNext: !!goal,
      component: <SelectGoal goal={goal} setGoal={setGoal} />,
    },
    {
      key: 'area',
      showNext: !!area,
      component: <SelectArea area={area} setArea={setArea} />,
    },
    {
      key: 'equipment',
      showNext: !!equipment,
      component: (
        <SelectEquipment equipment={equipment} setEquipment={setEquipment} />
      ),
    },
    {
      key: 'experience',
      showNext: !!equipment,
      component: (
        <SelectExperience
          experience={experience}
          setExperience={setExperience}
        />
      ),
    },
    {
      key: 'goals',
      component: <Goals goal={goal} />,
    },
  ];

  useBackHandler(() => true);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <View style={{marginTop: 10}}>
        <StepIndicator
          stepCount={slides.length}
          currentPosition={index}
          customStyles={{
            stepStrokeCurrentColor: colors.appBlue,
            separatorUnFinishedColor: colors.borderColor,
            separatorFinishedColor: colors.appBlue,
            stepIndicatorUnFinishedColor: colors.borderColor,
            stepIndicatorFinishedColor: colors.appBlue,
          }}
        />
      </View>
      {fromProfile && <Header hasBack />}
      <PagerView
        ref={ref}
        onPageSelected={e => {
          setIndex(e.nativeEvent.position);
          Keyboard.dismiss();
        }}
        removeClippedSubviews={false}
        scrollEnabled={false}
        style={{flex: 1}}>
        {slides.map((slide, i) => {
          return (
            <View style={{flex: 1}} key={slide.key}>
              {slide.component}
              <View
                style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  right: 20,
                  left: 20,
                  bottom: 20,
                }}>
                {i !== 0 && (
                  <Button
                    variant="secondary"
                    style={{
                      flex: 1,
                      marginRight: 10,
                    }}
                    onPress={goBack}
                    text="Previous"
                  />
                )}
                {i < slides.length - 1 && (
                  <Button
                    style={{
                      flex: 1,
                      marginLeft: index === 0 ? 0 : 10,
                    }}
                    disabled={!slide.showNext}
                    onPress={goNext}
                    text="Next"
                  />
                )}
                {i === slides.length - 1 && (
                  <Button
                    text="complete"
                    onPress={completeSignUp}
                    disabled={loading}
                    loading={loading}
                    style={{
                      flex: 1,
                      marginLeft: 10,
                    }}
                  />
                )}
              </View>
            </View>
          );
        })}
      </PagerView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
