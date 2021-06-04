import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {eventChannel} from '@redux-saga/core';
import {EventChannel} from '@redux-saga/core';
import moment from 'moment';
import {take, call, select, put, all, takeEvery} from 'redux-saga/effects';
import {
  setLoggedIn,
  setProfile,
  SIGN_UP,
  SignUpAction,
  setMonthlyWeightSamples,
  GET_SAMPLES,
  setMonthlyStepSamples,
  setWeeklySteps,
} from '../actions/profile';
import {getTests} from '../actions/tests';
import {getProfileImage} from '../helpers/images';
import Profile from '../types/Profile';
import {MyRootState, Sample, StepSample} from '../types/Shared';
import * as api from '../helpers/api';
import {goBack, navigate, resetToTabs} from '../RootNavigation';
import {Alert} from 'react-native';
import {
  getActivitySamples,
  getStepSamples,
  getWeeklySteps,
  getWeightSamples,
  initBiometrics,
  isEnabled,
  saveHeight,
  saveWeight,
} from '../helpers/biometrics';

function* getSamplesWorker() {
  const month = moment().month();

  const weeklySteps: StepSample[] = yield call(getWeeklySteps);
  yield put(setWeeklySteps(weeklySteps));

  const stepSamples: StepSample[] = yield call(getStepSamples);
  yield put(setMonthlyStepSamples(stepSamples, month));

  const {weightMetric} = yield select(
    (state: MyRootState) => state.profile.profile,
  );
  const weightSamples: Sample[] = yield call(getWeightSamples, weightMetric);
  yield put(setMonthlyWeightSamples(weightSamples, month));

  const activitySamples = yield call(getActivitySamples);
}

function onAuthStateChanged() {
  return eventChannel(emitter => {
    const subscriber = auth().onAuthStateChanged(user => {
      emitter({user});
    });
    return subscriber;
  });
}

function* signUp(action: SignUpAction) {
  const {
    dry,
    name,
    dob,
    weight,
    weightMetric,
    height,
    heightMetric,
    gender,
    goals,
    workoutFrequency,
    purpose,
    password,
    email,
  } = action.payload;
  try {
    try {
      const enabled: boolean = yield call(isEnabled);
      if (enabled) {
        yield call(saveWeight, weight, weightMetric);
        yield call(saveHeight, height, heightMetric);
      }
    } catch (e) {
      console.log(e);
    }
    if (dry) {
      yield call(api.createUser, email, password, {
        signedUp: true,
        name,
        dob,
        weight,
        weightMetric,
        height,
        heightMetric,
        gender,
        goals,
        workoutFrequency,
        purpose,
      });
      goBack();
    } else {
      const {profile} = yield select((state: MyRootState) => state.profile);
      yield call(api.updateUser, {
        ...profile,
        signedUp: true,
        name,
        dob,
        weight,
        weightMetric,
        height,
        heightMetric,
        gender,
        goals,
        workoutFrequency,
        purpose,
      });
      yield put(
        setProfile({
          ...profile,
          name,
          dob,
          weight,
          weightMetric,
          height,
          heightMetric,
          gender,
          goals,
          workoutFrequency,
          purpose,
        }),
      );
      resetToTabs();
    }
  } catch (e) {
    Alert.alert('Error', e.message);
  }
}

export default function* profileSaga() {
  yield all([
    takeEvery(SIGN_UP, signUp),
    takeEvery(GET_SAMPLES, getSamplesWorker),
  ]);

  const channel: EventChannel<{user: FirebaseAuthTypes.User}> = yield call(
    onAuthStateChanged,
  );
  while (true) {
    const {user}: {user: FirebaseAuthTypes.User} = yield take(channel);
    try {
      if (user && user.emailVerified) {
        const doc: FirebaseFirestoreTypes.DocumentSnapshot = yield call(
          api.getUser,
          user,
        );
        if (doc.exists) {
          yield put(setProfile(doc.data() as Profile));
        } else {
          const avatar = getProfileImage(user);
          const userObj = {
            uid: user.uid,
            email: user.email,
            avatar,
            name: user.displayName,
          };
          yield put(setProfile(userObj));
          yield call(api.setUser, userObj);
        }

        if (doc.exists && doc.data().signedUp) {
          yield call(initBiometrics);
          resetToTabs();
        } else {
          navigate('SignUpFlow');
        }
        yield put(setLoggedIn(true));
        yield put(getTests());
      } else if (user) {
        Alert.alert(
          'Account not verified',
          'Please verify your account using the link we sent to your email address',
        );
      } else {
        yield put(setLoggedIn(false));
      }
    } catch (e) {
      console.log(e);
    }
  }
}
