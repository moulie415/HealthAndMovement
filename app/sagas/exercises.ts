import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
  take,
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
} from '../actions/exercises';
import Exercise from '../types/Exercise';
import * as api from '../helpers/api';
import {MyRootState} from '../types/Shared';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {SavedWorkout} from '../types/SavedItem';
import queryString from 'query-string';
import {Alert} from 'react-native';
import {navigate} from '../RootNavigation';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';

export function* getExercises(action: GetExercisesAction) {
  const {level, goal, area, cardioType} = action.payload;
  yield put(setLoading(true));
  const exercises: {[key: string]: Exercise} = yield call(
    api.getExercises,
    level,
    goal,
    area,
    cardioType,
  );
  yield put(setExercises(exercises));
  yield put(setLoading(false));
  const link: FirebaseDynamicLinksTypes.DynamicLink | null = yield call(
    dynamicLinks().getInitialLink,
  );
  if (link && link.url) {
    yield call(handleDeepLink, link.url);
  }
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
    yield call(Snackbar.show, {text: 'Workout saved'});
  } catch (e) {
    yield call(Snackbar.show, {text: 'Error saving workout'});
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
    yield put(setLoading(false));
    Snackbar.show({text: 'Error getting saved workouts'});
  }
}

function* getExercisesById(action: GetExercisesByIdAction) {
  try {
    const ids = action.payload;
    yield put(setLoading(true));
    if (ids.length) {
      const exercises: {[key: string]: Exercise} = yield call(
        api.getExercisesById,
        ids,
      );

      yield put(setExercises(exercises));
    }
    yield put(setLoading(false));
  } catch (e) {
    yield put(setLoading(false));
    console.log(e);
    Snackbar.show({text: 'Error fetching exercises'});
  }
}

function* handleDeepLink(url: string) {
  const parsed = queryString.parseUrl(url);
  if (parsed.url === 'healthandmovement://workout') {
    try {
      if (typeof parsed.query.exercises === 'string') {
        const exerciseIds = parsed.query.exercises.split(',');
        const exercises: {[key: string]: Exercise} = yield select(
          (state: MyRootState) => state.exercises.exercises,
        );
        const {premium, admin} = yield select(
          (state: MyRootState) => state.profile.profile,
        );
        const missing = exerciseIds.filter(id => {
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
          exerciseIds.includes(exercise.id),
        );

        if (filtered.some(exercise => exercise.premium) && !premium && !admin) {
          Alert.alert(
            'Sorry',
            'That workout link includes premium exercises, would you like to subscribe to premium?',
            [
              {text: 'No thanks'},
              {text: 'Yes', onPress: () => navigate('Premium')},
            ],
          );
        } else {
          yield put(setWorkout(filtered));
          navigate('ExerciseList');
          navigate('ReviewExercises');
        }
      }
    } catch (e) {
      Alert.alert(
        'Error',
        'Sorry Health and Movement had problems handling the link',
      );
    }
  }
}

function onDynamicLink() {
  return eventChannel(emitter => {
    const subscriber = dynamicLinks().onLink(link => {
      emitter(link);
    });
    return subscriber;
  });
}

export default function* exercisesSaga() {
  yield takeEvery(GET_EXERCISES, getExercises);
  yield takeEvery(ADD_EXERCISE, addExercise);
  yield takeEvery(DELETE_EXERCISE, deleteExercise);
  yield takeEvery(UPDATE_EXERCISE, updateExercise);
  yield takeLatest(SAVE_WORKOUT, saveWorkout);
  yield takeLatest(GET_SAVED_WORKOUTS, getSavedWorkouts);
  yield takeLatest(GET_EXERCISES_BY_ID, getExercisesById);

  const dynamicLinkChannel: EventChannel<FirebaseDynamicLinksTypes.DynamicLink> = yield call(
    onDynamicLink,
  );

  while (true) {
    const url: FirebaseDynamicLinksTypes.DynamicLink = yield take(
      dynamicLinkChannel,
    );
    yield call(handleDeepLink, url.url);
  }
}
