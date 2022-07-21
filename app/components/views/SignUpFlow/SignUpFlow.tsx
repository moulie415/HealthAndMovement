import React, {useState} from 'react';
import {
  Alert,
  Platform,
  Dimensions,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import {
  Gender,
  SleepPattern,
  StressLevel,
  TrainingAvailability,
  Unit,
} from '../../../types/Profile';
import {Goal, Level, MyRootState} from '../../../types/Shared';
import SignUpFlowProps from '../../../types/views/SIgnUpFlow';
import {signUp} from '../../../actions/profile';
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
import SelectUnit from './SelectUnit';
import SelectWeight from './SelectWeight';
import SelectSex from './SelectSex';
import useInit from '../../../hooks/UseInit';
import SelectHeight from './SelectHeight';
import SelectGoal from './SelectGoal';
import SelectExperience from './SelectExperience';
import SelectEquipment from './SelectEquipment';
import * as Progress from 'react-native-progress';
import CompleteSignUp from './CompleteSignUp';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DevicePixels from '../../../helpers/DevicePixels';
import {resetToWelcome} from '../../../RootNavigation';
import auth from '@react-native-firebase/auth';
import LetsBuild from './LetsBuild';
import Medications from './Medications';
import GeneralLifestyle from './GeneralLifeStyle';
import SleepPatterns from './SleepPatterns';
import StressLevels from './StressLevels';
import Occupation from './Occupation';
import PhysicalInjuries from './PhysicalInjuries';
import SelectTrainingAvailability from './TrainingAvailability';
import Nutrition from './Nutrition';
import Swiper from 'react-native-swiper';
import BackButton from '../../commons/BackButton';
import ForwardButton from '../../commons/ForwardButton';

const {width} = Dimensions.get('window');

const SignUpFlow: React.FC<SignUpFlowProps> = ({
  navigation,
  route,
  profile,
  signUp: signUpAction,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(profile.dob || new Date().toISOString());
  const [weight, setWeight] = useState<number>(profile.weight);
  const [unit, setUnit] = useState<Unit>(profile.unit || 'metric');
  const [equipment, setEquipment] = useState('');
  const [experience, setExperience] = useState<Level>();
  const [marketing, setMarketing] = useState(false);
  const [height, setHeight] = useState<number>(profile.height);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [goal, setGoal] = useState<Goal>(profile.goal);
  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [sleepPattern, setSleepPattern] = useState<SleepPattern>();
  const [stressLevel, setStressLevel] = useState<StressLevel>();
  const [occupation, setOccupation] = useState('');
  const [injuries, setInjuries] = useState('');
  const [trainingAvailability, setTrainingAvailability] =
    useState<TrainingAvailability>();
  const [nutrition, setNutrition] = useState([]);

  useInit(async () => {
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
    } else if (Platform.OS === 'ios') {
      try {
        await initBiometrics();
        const h = await getHeight();
        setHeight(h);
        const w = await getWeight();
        setWeight(w);
        const sex = await getSex();
        setGender(sex);
        const dateOfBirth = await getDateOfBirth();
        if (dateOfBirth) {
          setDob(dateOfBirth);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        logError(e);
      }
    }
    setLoading(false);
  });

  const completeSignUp = () => {
    setLoading(true);
    signUpAction({
      dob,
      weight,
      height,
      unit,
      gender,
      goal,
      experience,
      equipment,
      marketing,
      nutrition,
      trainingAvailability,
      injuries,
      occupation,
      stressLevel,
      sleepPattern,
      lifestyle,
      medications,
    });
  };

  const slides = [
    {
      showNext: true,
      key: 'letsBuild',
      component: <LetsBuild />,
    },
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
    {
      showNext: !!gender,
      key: 'sex',
      component: <SelectSex gender={gender} setGender={setGender} />,
    },
    // {
    //   color: colors.appBlue,
    //   showNext: !!unit,
    //   tint: colors.appWhite,
    //   component: <SelectUnit unit={unit} setUnit={setUnit} />,
    // },

    {
      showNext: !!weight,
      key: 'weight',
      component: (
        <SelectWeight
          weight={weight}
          setWeight={setWeight}
          unit={unit}
          gender={gender}
        />
      ),
    },
    {
      key: 'height',
      showNext: !!height,
      component: (
        <SelectHeight
          height={height}
          setHeight={setHeight}
          unit={unit}
          gender={gender}
        />
      ),
    },
    {
      key: 'goal',
      showNext: !!goal,
      component: <SelectGoal goal={goal} setGoal={setGoal} />,
    },
    {
      key: 'experience',
      showNext: !!experience,
      component: (
        <SelectExperience
          experience={experience}
          setExperience={setExperience}
        />
      ),
    },
    {
      key: 'equipment',
      showNext: true,
      component: (
        <SelectEquipment equipment={equipment} setEquipment={setEquipment} />
      ),
    },
    {
      key: 'medications',
      showNext: true,
      component: (
        <Medications
          medications={medications}
          setMedications={setMedications}
        />
      ),
    },
    {
      key: 'lifestyle',
      showNext: true,
      component: (
        <GeneralLifestyle lifestyle={lifestyle} setLifestyle={setLifestyle} />
      ),
    },
    {
      key: 'sleep',
      showNext: !!sleepPattern,
      component: (
        <SleepPatterns
          sleepPattern={sleepPattern}
          setSleepPattern={setSleepPattern}
        />
      ),
    },
    {
      key: 'stresslevel',
      showNext: !!stressLevel,
      component: (
        <StressLevels
          stressLevel={stressLevel}
          setStressLevel={setStressLevel}
        />
      ),
    },
    {
      key: 'occupation',
      component: (
        <Occupation occupation={occupation} setOccupation={setOccupation} />
      ),
      showNext: true,
    },
    {
      key: 'injuries',
      component: (
        <PhysicalInjuries injuries={injuries} setInjuries={setInjuries} />
      ),
      showNext: true,
    },
    {
      key: 'training',
      component: (
        <SelectTrainingAvailability
          trainingAvailability={trainingAvailability}
          setTrainingAvailability={setTrainingAvailability}
        />
      ),
      showNext: !!trainingAvailability,
    },
    {
      key: 'nutrition',
      component: (
        <Nutrition nutrition={nutrition} setNutrition={setNutrition} />
      ),
      showNext: true,
    },
    {
      key: 'complete',
      showNext: false,
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

  const [index, setIndex] = useState(0);

  useBackHandler(() => true);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Progress.Bar
        width={width}
        progress={(index + 1) / slides.length}
        color={colors.appBlue}
        style={{zIndex: 9}}
        borderWidth={0}
        borderRadius={0}
      />

      <Swiper
        onIndexChanged={setIndex}
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
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
