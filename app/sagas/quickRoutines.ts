import {
  call,
  debounce,
  fork,
  put,
  select,
  takeLatest,
  throttle,
} from 'redux-saga/effects';
import {
  GetQuickRoutinesByIdAction,
  GET_QUICK_ROUTINES,
  GET_QUICK_ROUTINES_BY_ID,
  GET_SAVED_QUICK_ROUTINES,
  SaveQuickRoutineAction,
  SAVE_QUICK_ROUTINE,
  setQuickRoutines,
  setSavedQuickRoutine,
} from '../actions/quickRoutines';
import * as api from '../helpers/api';
import QuickRoutine from '../types/QuickRoutines';
import {MyRootState} from '../types/Shared';
import Snackbar from 'react-native-snackbar';
import {SavedQuickRoutine} from '../types/SavedItem';
import {setLoading} from '../actions/exercises';
import {logError} from '../helpers/error';
import {handleWorkoutFinished} from './exercises';

export function* getQuickRoutines() {
  try {
    const routines: {[key: string]: QuickRoutine} = yield call(
      api.getQuickRoutines,
    );
    yield put(setQuickRoutines(routines));
  } catch (e) {
    logError(e);
  }
}

function* saveQuickRoutine(action: SaveQuickRoutineAction) {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield call(api.saveQuickRoutine, action.payload, uid);
    yield fork(handleWorkoutFinished);
    if (action.payload.saved) {
      yield call(Snackbar.show, {text: 'Workout saved '});
    }
  } catch (e) {
    logError(e);
    yield call(Snackbar.show, {text: 'Error saving workout'});
  }
}

export function* getSavedQuickRoutines() {
  try {
    yield put(setLoading(true));
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const savedQuickRoutines: {[key: string]: SavedQuickRoutine} = yield call(
      api.getSavedQuickRoutines,
      uid,
    );
    yield put(setSavedQuickRoutine(savedQuickRoutines));
    yield put(setLoading(false));
  } catch (e) {
    logError(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error getting saved workouts'});
  }
}

function* getQuickRoutinesById(action: GetQuickRoutinesByIdAction) {
  try {
    const ids = action.payload;
    yield put(setLoading(true));
    if (ids.length) {
      const routines: {[key: string]: QuickRoutine} = yield call(
        api.getQuickRoutinesById,
        ids,
      );
      yield put(setQuickRoutines(routines));
    }
    yield put(setLoading(false));
  } catch (e) {
    logError(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error fetching workouts'});
  }
}

export default function* quickRoutinesSaga() {
  yield throttle(5000, GET_QUICK_ROUTINES, getQuickRoutines);
  yield throttle(5000, SAVE_QUICK_ROUTINE, saveQuickRoutine);
  yield throttle(5000, GET_SAVED_QUICK_ROUTINES, getSavedQuickRoutines);
  yield throttle(5000, GET_QUICK_ROUTINES_BY_ID, getQuickRoutinesById);
}
