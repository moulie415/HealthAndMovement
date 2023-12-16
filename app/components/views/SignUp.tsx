import React, {useEffect, useState} from 'react';
import {Alert, Platform, SafeAreaView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {
  handleAuth,
  setLoginEmail,
  setLoginPassword,
} from '../../actions/profile';
import colors from '../../constants/colors';
import Text from '../commons/Text';
import Input from '../commons/Input';
import Button from '../commons/Button';
import {createUser} from '../../helpers/api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Header from '../commons/Header';
import {MyRootState} from '../../types/Shared';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {logError} from '../../helpers/error';

const SignUp: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'SignUp'>;
  handleAuth: (user: FirebaseAuthTypes.User) => void;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}> = ({
  navigation,
  handleAuth: handleAuthAction,
  email,
  password,
  setEmail,
  setPassword,
}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [setEmail, setPassword]);

  const signUp = async () => {
    try {
      if (password !== confirm) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      setLoading(true);
      const user = await createUser(email, password, {name, surname});
      handleAuthAction(user);
    } catch (e) {
      logError(e);
      setLoading(false);
      // @ts-ignore
      Alert.alert('Error', e.message);
    }
  };

  const getAuthString = () => {
    if (Platform.OS === 'ios') {
      return 'Google, Facebook or Apple login?';
    }
    return 'Google or Facebook login?';
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="always">
        <Header title="Registration" hasBack />
        <Text
          style={{
            color: colors.appWhite,
            margin: 20,
            marginTop: 0,
          }}>
          Please enter your personal details, then we will send you a
          verification email (please remember to check your junk/spam folder).
        </Text>
        <Input
          containerStyle={{
            marginHorizontal: 20,
          }}
          placeholder="First Name"
          onChangeText={setName}
          icon="user"
          value={name}
          placeholderTextColor="#fff"
          autoCorrect={false}
        />
        <Input
          containerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
          placeholder="Last Name"
          icon="user"
          onChangeText={setSurname}
          value={surname}
          placeholderTextColor="#fff"
          autoCorrect={false}
        />
        <Input
          containerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          icon="envelope"
          placeholderTextColor="#fff"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <Input
          containerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
          placeholder="Password"
          secure
          placeholderTextColor="#fff"
          onChangeText={setPassword}
          value={password}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Input
          containerStyle={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
          placeholder="Confirm password"
          secure
          placeholderTextColor="#fff"
          onChangeText={setConfirm}
          value={confirm}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Button
          loading={loading}
          disabled={
            loading || !password || !name || !surname || !email || !confirm
          }
          onPress={signUp}
          text="Sign Up"
          style={{
            marginHorizontal: 20,
            marginTop: 20,
          }}
        />

        <TouchableOpacity
          style={{marginTop: 10}}
          onPress={() => navigation.navigate('Login')}
          hitSlop={{
            top: 10,
            bottom: 10,
            right: 10,
            left: 10,
          }}>
          <Text
            style={{
              color: '#fff',
              marginHorizontal: 20,
              textAlign: 'center',
            }}>
            Already have an account or want to use {getAuthString()}
            {'  '}
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
              }}>
              Log in
            </Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  email: profile.loginEmail,
  password: profile.loginPassword,
});

const mapDispatchToProps = {
  handleAuth,
  setEmail: setLoginEmail,
  setPassword: setLoginPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
