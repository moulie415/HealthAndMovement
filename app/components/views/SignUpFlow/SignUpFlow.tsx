import React, {useRef, useState} from 'react';
import {
  Alert,
  Platform,
  Dimensions,
  SafeAreaView,
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import Profile, {Gender} from '../../../types/Profile';
import {Goal, Level, MyRootState} from '../../../types/Shared';
import {signUp, SignUpPayload} from '../../../actions/profile';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import Age from './Age';
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
import * as Progress from 'react-native-progress';
import CompleteSignUp from './CompleteSignUp';
import LetsBuild from './LetsBuild';
import Swiper from 'react-native-swiper';
import BackButton from '../../commons/BackButton';
import ForwardButton from '../../commons/ForwardButton';
import Header from '../../commons/Header';
import FastImage from 'react-native-fast-image';
import Name from './Name';
import Goals from './Goals';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import SelectWeight from './SelectWeight';
import SelectHeight from './SelectHeight';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(profile.dob || new Date().toISOString());
  const [weight, setWeight] = useState<number>(profile.weight || 0);

  const [marketing, setMarketing] = useState(profile.marketing || false);
  const [height, setHeight] = useState<number>((profile.height as number) || 0);
  const [gender, setGender] = useState<Gender>(
    (profile.gender as Gender) || null,
  );
  const [goal, setGoal] = useState<Goal>((profile.goal as Goal) || null);
  const [loading, setLoading] = useState(false);

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

  const completeSignUp = () => {
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
      fromProfile: !!fromProfile,
    });
  };

  const [index, setIndex] = useState(0);

  const ref = useRef<Swiper>(null);

  const goNext = () => ref.current?.scrollTo(index + 1);

  const slides = [
    // 0
    // {
    //   showNext: false,
    //   key: 'letsBuild',
    //   component: <LetsBuild goNext={goNext} />,
    // },
    // 1
    {
      showNext: !!name && !!surname,
      key: 'name',
      component: (
        <Name
          name={name}
          surname={surname}
          setName={setName}
          setSurname={setSurname}
        />
      ),
    },
    // 2
    {
      showNext: !!dob,
      key: 'age',
      component: (
        <Age
          dob={dob}
          setDob={setDob}
          setShowDatePicker={setShowDatePicker}
          showDatePicker={showDatePicker}
        />
      ),
    },
    // 3
    // {
    //   showNext: !!gender,
    //   key: 'sex',
    //   component: <SelectSex gender={gender} setGender={setGender} />,
    // },
    // {
    //   color: colors.appBlue,
    //   showNext: !!unit,
    //   tint: colors.appWhite,
    //   component: <SelectUnit unit={unit} setUnit={setUnit} />,
    // },
    // 4
    {
      showNext: !!weight,
      key: 'weight',
      component: (
        <SelectWeight
          weight={weight}
          setWeight={setWeight}
          unit="metric"
          gender={gender}
          index={index}
        />
      ),
    },
    // 5
    {
      key: 'height',
      showNext: !!height,
      component: (
        <SelectHeight
          height={height}
          setHeight={setHeight}
          unit="metric"
          gender={gender}
          index={index}
        />
      ),
    },
    // 6
    {
      key: 'goal',
      showNext: !!goal,
      component: <SelectGoal goal={goal} setGoal={setGoal} />,
    },
    // 7
    // {
    //   key: 'experience',
    //   showNext: !!experience,
    //   component: (
    //     <SelectExperience
    //       experience={experience}
    //       setExperience={setExperience}
    //     />
    //   ),
    // },
    // 8
    // {
    //   key: 'equipment',
    //   showNext: true,
    //   component: (
    //     <SelectEquipment equipment={equipment} setEquipment={setEquipment} />
    //   ),
    // },
    // 9

    // {
    //   key: 'medications',
    //   showNext: true,
    //   component: (
    //     <Medications
    //       medications={medications}
    //       setMedications={setMedications}
    //     />
    //   ),
    // },
    // 10
    // {
    //   key: 'lifestyle',
    //   showNext: true,
    //   component: (
    //     <GeneralLifestyle lifestyle={lifestyle} setLifestyle={setLifestyle} />
    //   ),
    // },
    // 11
    // {
    //   key: 'sleep',
    //   showNext: !!sleepPattern,
    //   component: (
    //     <SleepPatterns
    //       sleepPattern={sleepPattern}
    //       setSleepPattern={setSleepPattern}
    //     />
    //   ),
    // },
    // 12
    // {
    //   key: 'stresslevel',
    //   showNext: !!stressLevel,
    //   component: (
    //     <StressLevels
    //       stressLevel={stressLevel}
    //       setStressLevel={setStressLevel}
    //     />
    //   ),
    // },
    // 13
    // {
    //   key: 'occupation',
    //   component: (
    //     <Occupation occupation={occupation} setOccupation={setOccupation} />
    //   ),
    //   showNext: true,
    // },
    // 14
    // {
    //   key: 'injuries',
    //   component: (
    //     <PhysicalInjuries injuries={injuries} setInjuries={setInjuries} />
    //   ),
    //   showNext: true,
    // },
    // 15
    // {
    //   key: 'training',
    //   component: (
    //     <SelectTrainingAvailability
    //       trainingAvailability={trainingAvailability}
    //       setTrainingAvailability={setTrainingAvailability}
    //     />
    //   ),
    //   showNext: !!trainingAvailability,
    // },
    // 16
    // {
    //   key: 'nutrition',
    //   component: (
    //     <Nutrition nutrition={nutrition} setNutrition={setNutrition} />
    //   ),
    //   showNext: true,
    // },
    //
    // 17

    {
      key: 'goals',
      showNext: true,
      component: <Goals goal={goal} />,
    },
    // 18
    {
      key: 'complete',
      showNext: true,
      component: (
        <CompleteSignUp
          completeSignUp={completeSignUp}
          loading={loading}
          marketing={marketing}
          setMarketing={setMarketing}
        />
      ),
    },
  ];

  useBackHandler(() => true);

  return (
    <FastImage
      source={require('../../../images/login.jpeg')}
      blurRadius={5}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.appBlack,
          opacity: 0.5,
        }}
      />
      <SafeAreaView style={{flex: 1}}>
        <Progress.Bar
          width={width}
          progress={(index + 1) / slides.length}
          color={colors.appBlue}
          style={{zIndex: 9}}
          borderWidth={0}
          borderRadius={0}
        />
        {fromProfile && <Header hasBack />}
        <Swiper
          ref={ref}
          onIndexChanged={i => {
            setIndex(i);
            Keyboard.dismiss();
          }}
          loop={false}
          removeClippedSubviews={false}
          showsPagination={false}
          scrollEnabled={false}
          prevButton={<BackButton disabled />}
          nextButton={<ForwardButton disabled />}
          showsButtons={slides[index].showNext}>
          {slides.map(slide => {
            return (
              <View style={{flex: 1}} key={slide.key}>
                {slide.component}
              </View>
            );
          })}
        </Swiper>
      </SafeAreaView>
    </FastImage>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
