import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
  take,
  all,
  fork,
  throttle,
} from 'redux-saga/effects';
import {eventChannel} from '@redux-saga/core';
import {EventChannel} from '@redux-saga/core';
import Snackbar from 'react-native-snackbar';
import {
  AddExerciseAction,
  ADD_EXERCISE,
  DeleteExerciseAction,
  DELETE_EXERCISE,
  GetExercisesAction,
  GetExercisesByIdAction,
  GET_EXERCISES,
  GET_EXERCISES_BY_ID,
  GET_SAVED_WORKOUTS,
  SaveWorkoutAction,
  SAVE_WORKOUT,
  setExercises,
  setLoading,
  setSavedWorkouts,
  setWorkout,
  UpdateExerciseAction,
  UPDATE_EXERCISE,
  viewWorkout,
  ViewWorkoutAction,
  VIEW_WORKOUT,
} from '../actions/exercises';
import Exercise from '../types/Exercise';
import * as api from '../helpers/api';
import {MyRootState} from '../types/Shared';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {SavedWorkout} from '../types/SavedItem';
import queryString from 'query-string';
import {Alert} from 'react-native';
import {navigate, resetToTabs} from '../RootNavigation';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import Profile from '../types/Profile';
import {alertPremiumFeature} from '../helpers/exercises';
import {logError} from '../helpers/error';
import * as _ from 'lodash';
import {setProfile} from '../actions/profile';
import * as polar from '../helpers/polar';
import {
  IOSAchievement,
  getAchievements,
  submitAchievementScore,
} from '../helpers/achievements';

export function* getExercises(action: GetExercisesAction) {
  const {level, goal, warmUp, coolDown} = action.payload;
  yield put(setLoading(true));
  const exercises: {[key: string]: Exercise} = yield call(
    api.getExercises,
    level,
    goal,
    warmUp,
    coolDown,
  );
  yield put(setExercises(exercises));
  yield put(setLoading(false));
}

export function* deleteExercise(action: DeleteExerciseAction) {
  const id = action.payload;
  yield call(api.deleteExercise, id);
  const {exercises} = yield select((state: MyRootState) => state.exercises);
  delete exercises[id];
  yield put(setExercises(exercises));
  Snackbar.show({text: 'Exercise deleted'});
}

export function* addExercise(action: AddExerciseAction) {
  const exercise = action.payload;
  const ref: FirebaseFirestoreTypes.DocumentReference = yield call(
    api.addExercise,
    exercise,
  );
  const {id} = ref;
  const {exercises} = yield select((state: MyRootState) => state.exercises);

  yield put(setExercises({...exercises, [id]: exercise}));
  Snackbar.show({text: 'Exercise added'});
}

export function* updateExercise(action: UpdateExerciseAction) {
  const exercise = action.payload;
  yield call(api.updateExercise, exercise);
  // const exercises = { ...getState().exercises.exercises, [exercise.id]: exercise };
  // dispatch(setExercises(exercises));
  Snackbar.show({text: 'Exercise updated'});
}

export function* saveWorkout(action: SaveWorkoutAction) {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield call(api.saveWorkout, action.payload, uid);
    yield fork(handleWorkoutFinished);
    if (action.payload.saved) {
      yield call(Snackbar.show, {text: 'Workout saved'});
    }
  } catch (e) {
    logError(e);
    yield call(Snackbar.show, {text: 'Error saving workout'});
  }
}

export function* handleWorkoutFinished() {
  const firstWorkout = 'first_workout';
  const achievements: IOSAchievement[] = yield call(getAchievements);

  if (
    !(
      achievements &&
      achievements.some(achievement => achievement.identifier === firstWorkout)
    )
  ) {
    yield call(submitAchievementScore, 100, firstWorkout);
  }
}

function* getSavedWorkouts() {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield put(setLoading(true));
    const workouts: {[key: string]: SavedWorkout} = yield call(
      api.getSavedWorkouts,
      uid,
    );
    yield put(setSavedWorkouts(workouts));
    yield put(setLoading(false));
  } catch (e) {
    logError(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error getting saved workouts'});
  }
}

export function* getExercisesById(action: GetExercisesByIdAction) {
  try {
    const ids = _.uniq(action.payload);
    yield put(setLoading(true));
    if (ids.length) {
      if (ids.length > 10) {
        const exercises: {[key: string]: Exercise} = yield call(
          api.getAllExercises,
        );
        yield put(setExercises(exercises));
      } else {
        const exercises: {[key: string]: Exercise} = yield call(
          api.getExercisesById,
          ids,
        );
        yield put(setExercises(exercises));
      }
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    logError(e);
    Snackbar.show({text: 'Error fetching exercises'});
  }
}

export function* viewWorkoutWatcher(action: ViewWorkoutAction) {
  try {
    yield put(setLoading(true));
    const ids = action.payload;
    const exercises: {[key: string]: Exercise} = yield select(
      (state: MyRootState) => state.exercises.exercises,
    );
    const {premium, admin} = yield select(
      (state: MyRootState) => state.profile.profile,
    );
    const missing = ids.filter(id => {
      return !exercises[id];
    });
    if (missing.length) {
      yield call(getExercisesById, {
        type: GET_EXERCISES_BY_ID,
        payload: missing,
      });
    }
    const updatedExercises: {[key: string]: Exercise} = yield select(
      (state: MyRootState) => state.exercises.exercises,
    );
    const filtered = Object.values(updatedExercises).filter(exercise =>
      ids.includes(exercise.id || ''),
    );

    if (filtered.some(exercise => exercise.premium) && !premium && !admin) {
      resetToTabs();
      yield put(setLoading(false));
      Alert.alert(
        'Sorry',
        'That workout link includes premium exercises, would you like to subscribe to premium?',
        [
          {text: 'No thanks'},
          {text: 'Yes', onPress: () => navigate('Premium', {})},
        ],
      );
    } else {
      yield put(setLoading(false));
      yield put(setWorkout(filtered));
      resetToTabs();
      navigate('ReviewExercises');
    }
  } catch (e) {
    resetToTabs();
    Snackbar.show({text: 'Error fetching exercises'});
    yield put(setLoading(false));
    logError(e);
  }
}

export function* handleDeepLink(url: string) {
  const parsed = queryString.parseUrl(url);
  const {loggedIn, profile} = yield select(
    (state: MyRootState) => state.profile,
  );
  switch (parsed.url) {
    case 'https://healthandmovement/workout':
      try {
        if (loggedIn) {
          navigate('Loading');
          if (typeof parsed.query.exercises === 'string') {
            const exerciseIds = parsed.query.exercises.split(',');
            yield put(viewWorkout(exerciseIds));
          }
        } else {
          Alert.alert('Error', 'Please log in before using that link');
        }
      } catch (e) {
        if (e instanceof Error) {
          Alert.alert('Error handling link', e.message);
        }
        resetToTabs();
      }
      break;
    case 'https://healthandmovement/invite':
      try {
        if (loggedIn) {
          navigate('Loading');
          if (profile.premium) {
            if (typeof parsed.query.value === 'string') {
              const user: Profile = yield call(
                api.acceptInviteLink,
                parsed.query.value,
              );
              Snackbar.show({text: `You are now connected with ${user.name}`});
              resetToTabs();
              navigate('Connections');
            }
          } else {
            resetToTabs();
            alertPremiumFeature();
          }
        } else {
          Alert.alert('Error', 'Please log in before using that link');
        }
      } catch (e) {
        resetToTabs();
        if (e instanceof Error) {
          Alert.alert('Error handling link', e.message);
        }
      }
      break;
    case 'https://healthandmovement/garmin':
      const {garminAccessTokenSecret, garminAccessToken} = parsed.query;
      if (garminAccessTokenSecret && garminAccessToken) {
        yield put(
          setProfile({...profile, garminAccessToken, garminAccessTokenSecret}),
        );
        Snackbar.show({text: 'Garmin Connect authorization successful'});
      } else {
        Alert.alert('Error', 'Error processing link');
      }
      break;
    case 'https://healthandmovement/polar':
      const {polarAccessToken} = parsed.query;
      if (polarAccessToken) {
        yield put(setProfile({...profile, polarAccessToken}));
        yield call(polar.registerUser, profile.uid, polarAccessToken as string);
        Snackbar.show({text: 'Polar authorization successful'});
      } else {
        Alert.alert('Error', 'Error processing link');
      }
      break;
    case 'https://healthandmovement/fitbit':
      const {
        fitbitToken,
        fitbitRefreshToken,
        fitbitUserId,
        fitbitTokenExpiresIn,
        fitbitTokenTimestamp,
      } = parsed.query;
      if (fitbitToken && fitbitRefreshToken) {
        yield put(
          setProfile({
            ...profile,
            fitbitToken,
            fitbitRefreshToken,
            fitbitUserId,
            fitbitTokenExpiresIn,
            fitbitTokenTimestamp,
          }),
        );
        Snackbar.show({text: 'Fitbit authorization successful'});
      } else {
        Alert.alert('Error', 'Error processing link');
      }
      break;
    default:
      Alert.alert('Error', 'Invalid link');
  }
}

function onDynamicLink() {
  return eventChannel(emitter => {
    const subscriber = dynamicLinks().onLink(({url}) => {
      emitter(url);
    });
    return subscriber;
  });
}

export default function* exercisesSaga() {
  yield all([
    throttle(5000, GET_EXERCISES, getExercises),
    takeLatest(ADD_EXERCISE, addExercise),
    takeLatest(DELETE_EXERCISE, deleteExercise),
    takeLatest(UPDATE_EXERCISE, updateExercise),
    throttle(5000, SAVE_WORKOUT, saveWorkout),
    throttle(5000, GET_SAVED_WORKOUTS, getSavedWorkouts),
    throttle(5000, GET_EXERCISES_BY_ID, getExercisesById),
    throttle(5000, VIEW_WORKOUT, viewWorkoutWatcher),
  ]);

  const dynamicLinkChannel: EventChannel<FirebaseDynamicLinksTypes.DynamicLink> =
    yield call(onDynamicLink);

  while (true) {
    const url: string = yield take(dynamicLinkChannel);
    yield call(handleDeepLink, url);
  }
}
