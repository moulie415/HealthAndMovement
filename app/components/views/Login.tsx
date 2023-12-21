import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  Platform,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import colors from '../../constants/colors';
import Text from '../commons/Text';
import {
  appleSignIn,
  facebookSignIn,
  googleSignIn,
  signIn,
} from '../../helpers/api';
import appleAuth from '@invertase/react-native-apple-authentication';
import Input from '../commons/Input';
import Button from '../commons/Button';
import GoogleLogo from '../../images/google.svg';
import Spinner from '../commons/Spinner';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  handleAuth,
  setLoginEmail,
  setLoginPassword,
  signUp,
} from '../../reducers/profile';

const Login: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Login'>;
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
  const [facebookLoading, setFacebookLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const signInApple = async () => {
    try {
      setAppleLoading(true);
      await appleSignIn();
    } catch (e) {
      setAppleLoading(false);
    }
  };

  const signInFacebook = async () => {
    try {
      setFacebookLoading(true);
      await facebookSignIn();
    } catch (e) {
      setFacebookLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      setGoogleLoading(true);
      await googleSignIn();
    } catch (e) {
      setGoogleLoading(false);
    }
  };

  const signInEmail = async () => {
    try {
      setLoading(true);
      await signIn(email, password, handleAuthAction);
    } catch (e) {
      setLoading(false);
    }
  };

  const disabled = facebookLoading || googleLoading || appleLoading || loading;

  return (
    <FastImage
      source={require('../../images/login.jpeg')}
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
      <SafeAreaView>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="always">
          <View style={{}}>
            <View
              style={{
                width: 175,
                height: 175,
                borderRadius: 90,
                backgroundColor: 'rgba(255,255,255, 0.2)',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 60,
              }}>
              <View
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                  backgroundColor: colors.appWhite,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../../images/logo.png')}
                  style={{width: 90, height: 79}}
                />
              </View>
            </View>

            <Input
              onChangeText={setEmail}
              value={email}
              containerStyle={{
                marginHorizontal: 20,
                marginTop: 60,
              }}
              placeholder="Email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholderTextColor={colors.appWhite}
              icon="envelope"
            />
            <Input
              onChangeText={setPassword}
              value={password}
              containerStyle={{
                marginHorizontal: 20,
                marginTop: 20,
              }}
              placeholder="Password"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.appWhite}
              secure
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              hitSlop={{
                top: 10,
                bottom: 10,
                right: 10,
                left: 10,
              }}
              style={{
                alignSelf: 'flex-end',
                marginRight: 20,
                marginTop: 10,
              }}>
              <Text style={{color: colors.appWhite}}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              disabled={loading}
              loading={loading}
              text="Log in"
              style={{
                marginHorizontal: 20,
                marginTop: 20,
              }}
              onPress={signInEmail}
            />
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                paddingVertical: 10,
              }}>
              OR
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              {Platform.OS === 'ios' && appleAuth.isSupported && (
                <TouchableOpacity
                  disabled={disabled}
                  onPress={signInApple}
                  style={{
                    height: 70,
                    width: 70,
                    marginHorizontal: 5,
                    marginLeft: 10,
                    borderColor: '#36415F',
                    borderWidth: 2,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {appleLoading ? (
                    <Spinner />
                  ) : (
                    <Icon name="apple" color="#fff" size={35} />
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={signInFacebook}
                disabled={disabled}
                style={{
                  height: 70,
                  width: 70,
                  marginHorizontal: 5,
                  marginLeft: Platform.OS === 'ios' ? 5 : 10,
                  borderColor: '#36415F',
                  borderWidth: 2,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {facebookLoading ? (
                  <Spinner />
                ) : (
                  <Icon color="#fff" name="facebook-f" size={35} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={signInGoogle}
                disabled={disabled}
                style={{
                  height: 70,
                  width: 70,
                  marginHorizontal: 5,
                  marginRight: 10,

                  borderColor: '#36415F',
                  borderWidth: 2,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {googleLoading ? <Spinner /> : <GoogleLogo width={35} />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{marginVertical: 20, alignSelf: 'center'}}
              onPress={() => {
                navigation.navigate('SignUp');
              }}>
              <Text style={{color: 'rgba(255, 255, 255, 0.56)'}}>
                {"Don't have an account? "}
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  Sign up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </FastImage>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  loggedIn: profile.loggedIn,
  email: profile.loginEmail,
  password: profile.loginPassword,
});

const mapDispatchToProps = {
  signUp,
  handleAuth,
  setEmail: setLoginEmail,
  setPassword: setLoginPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
