import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import {appleSignIn, facebookSignIn, googleSignIn} from '../../helpers/api';
import Text from '../commons/Text';
import Button from '../commons/Button';
import Input from '../commons/Input';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../commons/Header';
import FastImage from 'react-native-fast-image';
import {setLoggedIn} from '../../reducers/profile';

const DeleteAccount: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'DeleteAccount'>;
  profile: Profile;
  setLoggedIn: (loggedIn: boolean) => void;
}> = ({profile, setLoggedIn: setLoggedInAction}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  useEffect(() => {
    const user = auth().currentUser;
    if (user?.providerData?.find(data => data.providerId === 'password')) {
      setRequiresPassword(true);
    }
  }, []);
  return (
    <FastImage
      source={require('../../images/login.jpeg')}
      blurRadius={5}
      style={{flex: 1}}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: '#000',
          opacity: 0.7,
        }}
      />
      <SafeAreaView>
        <Header hasBack title="Delete account" />
        <Text
          style={{
            color: '#fff',
            margin: 10,
            fontWeight: 'bold',
            lineHeight: 20,
          }}>
          {`We're sad to see you go, please enter your email${
            requiresPassword ? ' and password' : ''
          } to confirm deletion and be aware that this will delete all your CA Health data and it will not be recoverable.`}
        </Text>
        <View
          style={{
            margin: 10,
          }}>
          <Input
            placeholder="Email"
            onChangeText={e => setEmail(e)}
            value={email}
            placeholderTextColor="#fff"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            icon="envelope"
          />
        </View>
        {requiresPassword && (
          <View style={{margin: 10}}>
            <Input
              placeholder="Password"
              onChangeText={p => setPassword(p)}
              value={password}
              placeholderTextColor="#fff"
              autoCapitalize="none"
              autoCorrect={false}
              secure
            />
          </View>
        )}
        <Button
          text="Confirm account deletion"
          onPress={async () => {
            if (profile.admin) {
              return Alert.alert(
                'Account deletion via app disabled for admins',
                'Please contact the developer if this needs to be done',
              );
            }
            setLoading(true);
            try {
              const user = auth().currentUser;
              if (requiresPassword) {
                await auth().signInWithEmailAndPassword(email, password);
              }
              if (
                user?.providerData?.find(
                  data => data.providerId === 'google.com',
                )
              ) {
                await googleSignIn();
              }
              if (
                user?.providerData?.find(
                  data => data.providerId === 'facebook.com',
                )
              ) {
                await facebookSignIn();
              }
              if (
                user?.providerData?.find(
                  data => data.providerId === 'apple.com',
                )
              ) {
                await appleSignIn();
              }
              await user?.delete();
              setLoggedInAction(false);
              Alert.alert('Success', 'Your account has been deleted');
            } catch (e) {
              // @ts-ignore
              Alert.alert('Error', e.message);
            }
            setLoading(false);
          }}
          loading={loading}
          style={{
            margin: 10,
            marginTop: 5,
          }}
          disabled={
            email !== profile.email ||
            (requiresPassword && !password) ||
            loading
          }
        />
      </SafeAreaView>
    </FastImage>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
