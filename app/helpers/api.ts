import functions from '@react-native-firebase/functions';
import Profile from '../types/Profile';
import {CoolDown, Goal, Level, WarmUp} from '../types/Shared';
import {SavedQuickRoutine, SavedTest, SavedWorkout} from '../types/SavedItem';
import Snackbar from 'react-native-snackbar';
import Message from '../types/Message';
import {WeeklyItems} from '../reducers/profile';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import appleAuth from '@invertase/react-native-apple-authentication';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Alert} from 'react-native';

GoogleSignin.configure({
  webClientId:
    '48631950986-ibg0u91q5m6hsllkunhe9frf00id7r8c.apps.googleusercontent.com', // From Firebase Console Settings
});

export const appleSignIn = async () => {
  try {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw 'Apple Sign-In failed - no identify token returned';
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Error', e.message);
    }
    throw e;
  }
};

export const facebookSignIn = async () => {
  try {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    // Sign-in the user with the credential
    const credentials = await auth().signInWithCredential(facebookCredential);
    return credentials;
  } catch (e) {
    if (e !== 'User cancelled the login process') {
      if (e instanceof Error) {
        Alert.alert('Error', e.message);
      }
    }
    throw e;
  }
};

export const googleSignIn = async () => {
  // Get the users ID token
  try {
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const credentials = await auth().signInWithCredential(googleCredential);
    return credentials;
  } catch (e) {
    // @ts-ignore
    if (e.code !== statusCodes.SIGN_IN_CANCELLED) {
      if (e instanceof Error) {
        Alert.alert('Error', e.message);
      }
    }
    throw e;
  }
};

export const signIn = async (
  username: string,
  pass: string,
  handleAuthAction: (user: FirebaseAuthTypes.User) => void,
) => {
  try {
    if (username && pass) {
      const {user} = await auth().signInWithEmailAndPassword(username, pass);
      if (!user.emailVerified) {
        throw Error(
          'You must first verify your email using the link we sent you before logging in, please also check your spam folder',
        );
      } else {
        handleAuthAction(user);
      }
    } else {
      throw Error('Please enter both your email and your password');
    }
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Sorry', e.message);
    }
    throw e;
  }
};

export const getUser = async () => {
  const response = await functions().httpsCallable('getUser')();
  return response.data;
};

export const setUser = (user: Profile) => {
  return functions().httpsCallable('setUser')({user});
};

export const updateUser = (user: any) => {
  return functions().httpsCallable('updateUser')({user});
};

export const createUser = async (
  email: string,
  password: string,
  extraData: object,
) => {
  const {user} = await auth().createUserWithEmailAndPassword(email, password);
  await functions().httpsCallable('createUser')({user, extraData});
  if (!user.emailVerified) {
    await user.sendEmailVerification();
  }
  return user;
};

export const getExercises = async (
  level: Level,
  goal: Goal,
  warmUp: WarmUp[],
  coolDown: CoolDown[],
) => {
  const response = await functions().httpsCallable('getExercises')({
    level,
    goal,
    warmUp,
    coolDown,
  });
  return response.data;
};

export const getAllExercises = async () => {
  const response = await functions().httpsCallable('getAllExercises')();
  return response.data;
};

export const getExercisesById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const response = await functions().httpsCallable('getExercisesById')({ids});
  return response.data;
};

export const getTests = async () => {
  const response = await functions().httpsCallable('getTests')();
  return response.data;
};

export const getTestsById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const response = await functions().httpsCallable('getTestsById')({ids});
  return response.data;
};

export const getQuickRoutines = async () => {
  const response = await functions().httpsCallable('getQuickRoutines')();
  return response.data;
};

export const getQuickRoutinesById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const response = await functions().httpsCallable('getQuickRoutinesById')({
    ids,
  });
  return response.data;
};

export const saveWorkout = (workout: SavedWorkout) => {
  return functions().httpsCallable('saveWorkout')({workout});
};

export const saveTest = (test: SavedTest) => {
  return functions().httpsCallable('saveTest')({test});
};

export const saveQuickRoutine = (quickRoutine: SavedQuickRoutine) => {
  return functions().httpsCallable('saveQuickRoutine')({quickRoutine});
};

export const getSavedWorkouts = async () => {
  const response = await functions().httpsCallable('getSavedWorkouts')();
  return response.data;
};

export const getSavedTests = async () => {
  const response = await functions().httpsCallable('getSavedTests')();
  return response.data;
};

export const getSavedQuickRoutines = async () => {
  const response = await functions().httpsCallable('getSavedQuickRoutines')();
  return response.data;
};

export const getWeeklyItems = async (uid: string): Promise<WeeklyItems> => {
  const response = await functions().httpsCallable('getWeeklyItems')({uid});
  return response.data;
};

export const getEducation = async () => {
  const response = await functions().httpsCallable('getEducation')();
  return response.data;
};

export const getEducationById = async (ids: string[]) => {
  if (!ids?.length) {
    return [];
  }
  const response = await functions().httpsCallable('getEducationById')({ids});
  return response.data;
};

export const generateLink = async () => {
  try {
    const response = await functions().httpsCallable('generateLink')();
    return response.data.link;
  } catch (e) {
    Snackbar.show({text: 'Error generating link'});
  }
};

export const acceptInviteLink = async (value: string) => {
  const response = await functions().httpsCallable('acceptInviteLink')({
    value,
  });
  return response.data.user;
};

export const setFCMToken = (FCMToken: string) => {
  return functions().httpsCallable('setFCMToken')({FCMToken});
};

export const getConnections = async () => {
  const response = await functions().httpsCallable('getConnections')();
  return response.data.users;
};

export const getChats = async () => {
  const response = await functions().httpsCallable('getChats')();
  return response.data.users;
};

export const getMessages = async (chatId: string, startAfter: number) => {
  const response = await functions().httpsCallable('getMessages')({
    chatId,
    startAfter,
  });
  return response.data;
};

export const sendMessage = (
  message: Message,
  chatId: string,
  userId: string,
) => {
  return functions().httpsCallable('sendMessage')({message, chatId, userId});
};

export const setUnread = (unread: {[key: string]: number}) => {
  return functions().httpsCallable('setUnread')({unread});
};

export const getSettings = async () => {
  const response = await functions().httpsCallable('getSettings')();
  return response.data;
};

export const sendFeedback = async (feedback: string, rating: number) => {
  return functions().httpsCallable('sendFeedback')({feedback, rating});
};

export const getBodyFatPercentageSamples = async () => {
  const response = await functions().httpsCallable(
    'getBodyFatPercentageSamples',
  )();
  return response.data;
};

export const saveBodyFatPercentage = async (value: number) => {
  return functions().httpsCallable('saveBodyFatPercentage')({value});
};

export const getMuscleMassSamples = async () => {
  const response = await functions().httpsCallable('getMuscleMassSamples')();
  return response.data;
};

export const saveMuscleMass = (value: number) => {
  return functions().httpsCallable('saveMuscleMass')({value});
};

export const getBoneMassSamples = async () => {
  const response = await functions().httpsCallable('getBoneMassSamples')();
  return response.data;
};

export const saveBoneMass = (value: number) => {
  return functions().httpsCallable('saveBoneMass')({value});
};
