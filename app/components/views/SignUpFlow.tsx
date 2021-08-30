import {Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {Image, KeyboardAvoidingView, Platform} from 'react-native';
import {Bar} from 'react-native-progress';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import styles from '../../styles/views/SignUpFlow';
import {Gender, Unit} from '../../types/Profile';
import {Goal, MyRootState, Purpose} from '../../types/Shared';
import SignUpFlowProps from '../../types/views/SIgnUpFlow';
import AccountDetails from './AccountDetails';
import FitnessInfo from './FitnessInfo';
import Goals from './Goals';
import {signUp, setStep} from '../../actions/profile';

const SignUpFlow: React.FC<SignUpFlowProps> = ({
  navigation,
  route,
  profile,
  signUp: signUpAction,
  setStep: setStepAction,
  step,
}) => {
  const [dob, setDob] = useState(profile.dob);
  const [weight, setWeight] = useState<number>(profile.weight);
  const [unit, setUnit] = useState<Unit>(profile.unit || 'metric');

  const [height, setHeight] = useState<number>(profile.height);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(
    profile.goals || [],
  );
  const [workoutFrequency, setWorkoutFrequency] = useState(
    profile.workoutFrequency || 1,
  );
  const [purpose, setPurpose] = useState<Purpose>(profile.purpose);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(profile.name || '');

  const dry = route.params?.dry;
  const getTitle = () => {
    if (step === 0) {
      return 'Account details';
    }
    if (step === 1) {
      return 'Fitness Info';
    }
    return 'Goals';
  };

  const completeSignUp = () => {
    signUpAction({
      name,
      dob,
      weight,
      height,
      unit,
      gender,
      goals: selectedGoals,
      workoutFrequency,
      purpose,
      email,
      dry,
      password,
    });
  };

  return (
    <Layout style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        style={{flex: 1}}>
        <Image
          style={styles.logo}
          source={require('../../images/health_and_movement_logo_colour_centred.png')}
        />
        <Text category="h4" style={{textAlign: 'center'}}>
          Sign up with 3 easy steps
        </Text>
        <Bar
          color={colors.appBlue}
          width={200}
          style={{alignSelf: 'center', marginVertical: 10}}
          progress={(step + 1) / 3}
        />
        <Text style={{alignSelf: 'center', marginTop: 10}} category="h5">
          {getTitle()}
        </Text>
        {step === 0 && (
          <AccountDetails
            setStep={setStepAction}
            dry={dry}
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        )}
        {step === 1 && (
          <FitnessInfo
            weight={weight}
            setWeight={setWeight}
            height={height}
            setHeight={setHeight}
            gender={gender}
            setGender={setGender}
            dob={dob}
            setDob={setDob}
            setStep={setStepAction}
            unit={unit}
            setUnit={setUnit}
          />
        )}
        {step === 2 && (
          <Goals
            selectedGoals={selectedGoals}
            setSelectedGoals={setSelectedGoals}
            workoutFrequency={workoutFrequency}
            setWorkoutFrequency={setWorkoutFrequency}
            purpose={purpose}
            setPurpose={setPurpose}
            signUp={completeSignUp}
          />
        )}
      </KeyboardAvoidingView>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  step: profile.step,
});

const mapDispatchToProps = {
  signUp,
  setStep,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
