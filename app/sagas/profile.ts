import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';
import {eventChannel} from '@redux-saga/core';
import {EventChannel} from '@redux-saga/core';
import RNFetchBlob, {FetchBlobResponse} from 'rn-fetch-blob';
import analytics from '@react-native-firebase/analytics';
import moment from 'moment';
import {
  take,
  call,
  select,
  put,
  all,
  takeLatest,
  fork,
  debounce,
  throttle,
} from 'redux-saga/effects';
import {
  setLoggedIn,
  setProfile,
  SIGN_UP,
  SignUpAction,
  setWeightSamples,
  GET_SAMPLES,
  UPDATE_PROFILE,
  UpdateProfileAction,
  HandleAuthAction,
  HANDLE_AUTH,
  handleAuth,
  setPremium,
  setAdmin,
  GET_CONNECTIONS,
  setConnections,
  setLoading,
  setChats,
  SEND_MESSAGE,
  SendMessageAction,
  setMessage,
  SET_READ,
  SetReadAction,
  setUnread,
  SET_CHATS,
  SetChatsAction,
  setMessages,
  LOAD_EARLIER_MESSAGES,
  LoadEarlierMessagesAction,
  setMessagesObj,
  GET_WEEKLY_ITEMS,
  setWeeklyItems,
  setHeightSamples,
  SET_PREMIUM,
  setBodyFatPercentageSamples,
  setMuscleMassSamples,
  setBoneMassSamples,
} from '../actions/profile';
import {getTests} from '../actions/tests';
import {getProfileImage} from '../helpers/images';
import Profile from '../types/Profile';
import {MyRootState, Sample, StepSample} from '../types/Shared';
import * as api from '../helpers/api';
import {goBack, navigate, navigationRef, resetToTabs} from '../RootNavigation';
import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import {
  getBodyFatPercentageSamples,
  getBoneMassSamples,
  getHeightSamples,
  getMuscleMassSamples,
  getWeightSamples,
  initBiometrics,
  isAvailable,
  isEnabled,
  saveBodyFatPercentage,
  saveBoneMass,
  saveHeight,
  saveMuscleMass,
  saveWeight,
} from '../helpers/biometrics';
import Snackbar from 'react-native-snackbar';
import googleFit, {ActivitySampleResponse} from 'react-native-google-fit';
import Exercise from '../types/Exercise';
import Purchases, {PurchasesOfferings} from 'react-native-purchases';
import {setUserAttributes} from '../helpers/profile';
import {handleDeepLink} from './exercises';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import Chat from '../types/Chat';
import db from '@react-native-firebase/firestore';
import Sound from 'react-native-sound';
import {getSettings} from './settings';
import {SettingsState} from '../reducers/settings';
import {logError} from '../helpers/error';
import Message from '../types/Message';
import {WeeklyItems} from '../reducers/profile';
import {getQuickRoutinesById} from '../actions/quickRoutines';
import _ from 'lodash';
import {CLIENT_PREMIUM} from '../constants';
import isTestFlight from '../helpers/isTestFlight';
import {statusCodes} from '@react-native-google-signin/google-signin';
import GameCenter from 'react-native-game-center';
import {initAchievements} from '../helpers/achievements';

const notif = new Sound('notif.wav', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
  }
});

type Snapshot =
  FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;

function* getSamplesWorker() {
  const {uid} = yield select((state: MyRootState) => state.profile.profile);
  const weightSamples: Sample[] = yield call(getWeightSamples, 'metric');
  yield put(setWeightSamples(weightSamples));

  const heightSamples: Sample[] = yield call(getHeightSamples, 'metric');
  yield put(setHeightSamples(heightSamples));

  const bodyFatPercentageSamples: Sample[] = yield call(
    getBodyFatPercentageSamples,
    uid,
  );

  yield put(setBodyFatPercentageSamples(bodyFatPercentageSamples));

  const muscleMassSamples: Sample[] = yield call(getMuscleMassSamples, uid);
  yield put(setMuscleMassSamples(muscleMassSamples));

  const boneMassSamples: Sample[] = yield call(getBoneMassSamples, uid);
  yield put(setBoneMassSamples(boneMassSamples));

  // const stepSamples: StepSample[] = yield call(getStepSamples);
  // yield put(setStepSamples(stepSamples));

  // const activitySamples: HealthValue[] | ActivitySampleResponse[] = yield call(
  //   getActivitySamples,
  // );

  // if (activitySamples) {
  // }

  // const weeklySteps: StepSample[] = yield call(getWeeklySteps);
  // if (Platform.OS === 'ios') {
  //   const aggregatedWeeklySteps = Object.values(
  //     weeklySteps.reduce(
  //       (acc: {[key: string]: {date: string; value: number}}, cur) => {
  //         const date = moment(cur.date).format('YYYY-MM-DD');
  //         if (acc[date]) {
  //           acc[date] = {date, value: acc[date].value + cur.value};
  //         } else {
  //           acc[date] = {date, value: cur.value};
  //         }
  //         return acc;
  //       },
  //       {},
  //     ),
  //   );
  //   yield put(setWeeklySteps(aggregatedWeeklySteps));
  // } else {
  //   yield put(setWeeklySteps(weeklySteps));
  // }
}

function onAuthStateChanged() {
  return eventChannel(emitter => {
    const subscriber = auth().onAuthStateChanged(user => {
      emitter({user});
    });
    return subscriber;
  });
}

function* updateProfile(action: UpdateProfileAction) {
  const {
    weight,
    height,
    dob,
    gender,
    goal,
    avatar,
    bodyFatPercentage,
    muscleMass,
    boneMass,
  } = action.payload;
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const enabled: boolean = yield call(isEnabled);
    if (enabled) {
      if (weight) {
        yield call(saveWeight, weight, 'metric');
      }
      if (height) {
        yield call(saveHeight, height, 'metric');
      }
      if (bodyFatPercentage !== undefined) {
        yield call(saveBodyFatPercentage, bodyFatPercentage, uid);
      }
      if (muscleMass !== undefined) {
        yield call(saveMuscleMass, muscleMass, uid);
      }
      if (boneMass !== undefined) {
        yield call(saveBoneMass, boneMass, uid);
      }
    }
  } catch (e) {
    Alert.alert(
      'Error saving body measurement',
      "Please make sure you've given CA Health sufficient permissions",
      [
        {text: 'Cancel'},
        {
          text: `Open ${Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'}`,
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('health://');
            } else {
              googleFit.openFit();
            }
          },
        },
      ],
    );

    logError(e);
  }
  const {profile} = yield select((state: MyRootState) => state.profile);
  const updateObj = {
    ...profile,
    ...action.payload,
  };
  yield call(api.updateUser, updateObj, profile.uid);
  yield put(setProfile(updateObj));
  yield call(Snackbar.show, {text: 'Profile updated'});
  setUserAttributes({
    birthday: dob || '',
    weight: weight?.toString() || '',
    height: height?.toString() || '',
    unit: 'metric',
    gender: gender || '',
    goal: goal || '',
    uid: profile.uid || '',
  });
}

function* signUp(action: SignUpAction) {
  const {name, surname, dob, weight, height, gender, goal, fromProfile} =
    action.payload;
  try {
    try {
      const enabled: boolean = yield call(isEnabled);
      if (enabled) {
        yield call(saveWeight, weight);
        yield call(saveHeight, height);
      }
    } catch (e) {
      console.log(e);
    }

    const {profile} = yield select((state: MyRootState) => state.profile);
    const clientList: string[] = yield call(api.getClientList);
    const client = !!(clientList && clientList.includes(profile.email));
    yield call(
      api.updateUser,
      {
        ...profile,
        signedUp: true,
        ...action.payload,
        signUpDate: moment().unix(),
        client,
      },
      profile.uid,
    );
    yield put(
      setProfile({
        ...profile,
        ...action.payload,
        client,
      }),
    );
    if (fromProfile) {
      goBack();
    } else {
      resetToTabs();
    }

    setUserAttributes({
      name,
      surname,
      birthday: dob,
      weight: weight?.toString(),
      height: height?.toString(),
      gender: gender || '',
      goal,
      uid: profile.uid || '',
    });
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert('Error', e.message);
    }
  }
}

const WORKOUT_REMINDERS_ID = '1';
const TEST_REMINDERS_ID = '2';
export const WORKOUT_REMINDERS_CHANNEL_ID = 'WORKOUT_REMINDER_CHANNEL_ID';
export const TEST_REMINDERS_CHANNEL_ID = 'TEST_REMINDERS_CHANNEL_ID';
export const CONNECTION_ID = 'CONNECTION_ID';
export const MESSAGE_CHANNEL_ID = 'MESSAGE_CHANNEL_ID';
export const PLAN_CHANNEL_ID = 'PLAN_CHANNEL_ID';

const channels: {
  channelId: string;
  channelName: string;
  channelDescription: string;
}[] = [
  {
    channelId: WORKOUT_REMINDERS_CHANNEL_ID,
    channelName: 'Workout reminders',
    channelDescription: 'Daily reminders to workout',
  },
  {
    channelId: TEST_REMINDERS_CHANNEL_ID,
    channelName: 'Test reminders',
    channelDescription: 'Reminders to take a fitness test',
  },
  {
    channelId: CONNECTION_ID,
    channelName: 'Connections',
    channelDescription: 'Channel for in app connections',
  },
  {
    channelId: MESSAGE_CHANNEL_ID,
    channelName: 'Messages',
    channelDescription: 'Channel for receiving messages from connections',
  },
  {
    channelId: PLAN_CHANNEL_ID,
    channelName: 'Plan updates',
    channelDescription: 'Channel for get notified about your plan updates',
  },
];

function* createChannels() {
  channels.forEach(({channelId, channelName, channelDescription}) => {
    PushNotification.createChannel(
      {
        channelId,
        channelName,
        channelDescription,
      },
      created => console.log('channel created', created),
    );
  });
}

function* getWeeklyItems() {
  try {
    yield put(setLoading(true));
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const weeklyItems: WeeklyItems = yield call(api.getWeeklyItems, uid);
    const {quickRoutines} = yield select(
      (state: MyRootState) => state.quickRoutines,
    );
    const missingRoutines = Object.values(weeklyItems.quickRoutines)
      .filter(item => !quickRoutines[item.quickRoutineId])
      .map(routine => routine.quickRoutineId);
    yield put(getQuickRoutinesById(missingRoutines));
    yield put(setWeeklyItems(weeklyItems));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    logError(e);
    Snackbar.show({text: 'Error fetching weekly data'});
  }
}

function* getConnections() {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield put(setLoading(true));
    const connections: {[key: string]: Profile} = yield call(
      api.getConnections,
      uid,
    );
    const currentUnread: {[key: string]: number} = yield select(
      (state: MyRootState) => state.profile.profile.unread,
    );
    if (currentUnread) {
      // in case a friend had deleted their account we want to set unread back to 0
      const newUnread = Object.keys(currentUnread).reduce((acc, cur) => {
        if (connections[cur]) {
          return {...acc, [cur]: currentUnread[cur]};
        }
        if (cur === 'plan') {
          return {...acc, [cur]: currentUnread[cur]};
        }
        return acc;
      }, {});
      if (!_.isEqual(currentUnread, newUnread)) {
        yield call(api.setUnread, uid, newUnread);
        yield put(setUnread(newUnread));
      }
    }
    const chats: {[key: string]: Chat} = yield call(api.getChats, uid);
    yield put(setChats(chats));
    yield put(setConnections(connections));
    yield put(setLoading(false));
  } catch (e) {
    Snackbar.show({text: 'Error fetching connections'});
    logError(e);
    yield put(setLoading(false));
  }
}

function onChatMessage(id: string) {
  return eventChannel(emitter => {
    const subscriber = db()
      .collection('chats')
      .doc(id)
      .collection('messages')
      .limitToLast(20)
      .orderBy('createdAt')
      .onSnapshot(
        snapshot => {
          emitter(snapshot);
        },
        error => {
          console.warn(error);
        },
      );
    return subscriber;
  });
}

function* chatWatcher(uid: string, chatsObj: {[key: string]: Chat}) {
  const channel: EventChannel<Snapshot> = yield call(
    onChatMessage,
    chatsObj[uid].id,
  );
  while (true) {
    const snapshot: Snapshot = yield take(channel);
    yield put(setMessages(uid, snapshot));
    if (navigationRef.current) {
      const route: any = navigationRef.current.getCurrentRoute();
      const {state} = yield select((state: MyRootState) => state.profile);
      if (
        route.name === 'Chat' &&
        route.params?.uid === uid &&
        state === 'active'
      ) {
        notif.play();
      }
    }
  }
}

function* chatsWatcher(action: SetChatsAction) {
  const chatsObj = action.payload;
  const uids = Object.keys(chatsObj);
  for (const uid of uids) {
    yield fork(chatWatcher, uid, chatsObj);
  }
}

function* sendMessage(action: SendMessageAction) {
  const {chatId, message, uid} = action.payload;
  try {
    yield put(setMessage(uid, message));
    yield call(api.sendMessage, message, chatId, uid);
    notif.play();
  } catch (e) {
    if (e instanceof Error) {
      Snackbar.show({text: e.message});
    }
    yield put(setMessage(uid, {...message, sent: false, pending: false}));
    logError(e);
  }
}

function* setRead(action: SetReadAction) {
  try {
    const otherUid = action.payload;
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const current: {[key: string]: number} = yield select(
      (state: MyRootState) => state.profile.profile.unread,
    );
    if (current) {
      const unread = {...current, [otherUid]: 0};
      yield call(api.setUnread, uid, unread);
      yield put(setUnread(unread));
    }
  } catch (e) {
    console.warn(e);
    logError(e);
  }
}

function* loadEarlierMessages(action: LoadEarlierMessagesAction) {
  try {
    const {chatId, uid, startAfter} = action.payload;
    const {messages} = yield select((state: MyRootState) => state.profile);
    const current = messages[uid];
    yield put(setLoading(true));
    const earlier: {[key: string]: Message} = yield call(
      api.getMessages,
      chatId,
      startAfter,
    );
    yield put(setMessagesObj(uid, {...current, ...earlier}));
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    Snackbar.show({text: 'Error loading earlier messages'});
    logError(e);
  }
}

function* premiumUpdatedWorker() {
  while (true) {
    const oldPremium: boolean = yield select(
      (state: MyRootState) => state.profile.profile.premium,
    );
    yield take(SET_PREMIUM);
    const {premium, uid} = yield select(
      (state: MyRootState) => state.profile.profile,
    );
    if (!_.isEqual(oldPremium, premium)) {
      yield call(api.updateUser, {premium}, uid);
    }
  }
}

function* handleAuthWorker(action: HandleAuthAction) {
  const user = action.payload;
  try {
    if (
      user &&
      (user.emailVerified ||
        (user.providerData?.[0] &&
          user.providerData?.[0].providerId !== 'password'))
    ) {
      const doc: FirebaseFirestoreTypes.DocumentSnapshot = yield call(
        api.getUser,
        user.uid,
      );

      if (doc.exists) {
        yield put(setProfile(doc.data() as Profile));
      } else {
        const avatar = getProfileImage(user);
        const userObj = {
          uid: user.uid,
          email: user.email || '',
          avatar: avatar || '',
          name: user.displayName || '',
          providerId: user.providerData[0].providerId || '',
        };
        yield put(setProfile(userObj));
        yield call(api.setUser, userObj);
      }
      yield fork(premiumUpdatedWorker);
      const {customerInfo, created} = yield call(Purchases.logIn, user.uid);
      yield call(getSettings);
      const settings: SettingsState = yield select(
        (state: MyRootState) => state.settings,
      );
      const isAdmin = settings.admins.includes(user.uid);
      yield put(setAdmin(isAdmin));
      if (
        customerInfo.entitlements.active.Premium ||
        customerInfo.entitlements.active[CLIENT_PREMIUM] ||
        isAdmin ||
        isTestFlight()
      ) {
        yield put(setPremium(customerInfo.entitlements.active));
        yield fork(getConnections);
      } else {
        yield put(setPremium(false));
      }

      setUserAttributes({
        email: user.email || '',
        emailVerified: String(user.emailVerified),
        providerId: user.providerData[0].providerId,
        premium: customerInfo.entitlements.active.Premium ? 'true' : 'false',
        uid: user.uid || '',
        name: doc.exists ? doc.data()?.name || '' : '',
        surname: doc.exists ? doc.data()?.surname || '' : '',
      });
      if (doc.exists && doc.data()?.signedUp) {
        const available: boolean = yield call(isAvailable);
        if (available) {
          yield call(initBiometrics);
        }
        yield fork(initAchievements);
        resetToTabs();
        try {
          const getLinkPromise = () => {
            return new Promise<FirebaseDynamicLinksTypes.DynamicLink | null>(
              resolve => {
                dynamicLinks()
                  .getInitialLink()
                  .then(link => {
                    resolve(link);
                  });
              },
            );
          };
          const link: FirebaseDynamicLinksTypes.DynamicLink = yield call(
            getLinkPromise,
          );

          if (link && link.url) {
            yield call(handleDeepLink, link.url);
          }
        } catch (e: unknown) {
          logError(e);
        }

        const {premium} = yield select(
          (state: MyRootState) => state.profile.profile,
        );
        if (doc.data()?.unread && premium) {
          yield put(setUnread(doc.data()?.unread));
        }
      } else {
        navigate('SignUpFlow');
      }
      yield put(setLoggedIn(true));
      yield put(getTests());
      yield fork(createChannels);
      const version = Platform.Version as number;
      if (Platform.OS === 'android' && version >= 33) {
        yield call(
          PermissionsAndroid.request,
          'android.permission.POST_NOTIFICATIONS',
        );
      }
      messaging()
        .requestPermission()
        .then(async authStatus => {
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
          if (enabled) {
            try {
              const FCMToken = await messaging().getToken();
              api.setFCMToken(user.uid, FCMToken);
            } catch (e) {
              logError(e);
            }
          }
        });
    } else if (user) {
      Alert.alert(
        'Account not verified',
        'Please verify your account using the link we sent to your email address, please also check your spam folder',
      );
      navigate('Login');
    } else {
      yield put(setLoggedIn(false));
      navigate('Login');
    }
  } catch (e: any) {
    if (e.code === statusCodes.SIGN_IN_CANCELLED) {
      return;
    }
    navigate('Login');
    logError(e);
    if (e instanceof Error) {
      Alert.alert('Error', e.message);
    }
  }
}

export default function* profileSaga() {
  yield all([
    takeLatest(SIGN_UP, signUp),
    takeLatest(GET_SAMPLES, getSamplesWorker),
    takeLatest(UPDATE_PROFILE, updateProfile),
    debounce(3000, HANDLE_AUTH, handleAuthWorker),
    throttle(1000, GET_CONNECTIONS, getConnections),
    takeLatest(SEND_MESSAGE, sendMessage),
    debounce(1000, SET_READ, setRead),
    takeLatest(SET_CHATS, chatsWatcher),
    takeLatest(LOAD_EARLIER_MESSAGES, loadEarlierMessages),
    takeLatest(GET_WEEKLY_ITEMS, getWeeklyItems),
    debounce(3000, SET_PREMIUM, premiumUpdatedWorker),
  ]);

  const channel: EventChannel<{user: FirebaseAuthTypes.User}> = yield call(
    onAuthStateChanged,
  );
  while (true) {
    const {user}: {user: FirebaseAuthTypes.User} = yield take(channel);
    yield put(handleAuth(user));
  }
}
