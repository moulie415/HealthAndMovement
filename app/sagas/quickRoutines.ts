import {call, put, select, throttle} from 'redux-saga/effects';
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
import {ProfileState} from '../reducers/profile';
import {QuickRoutinesState} from '../reducers/quickRoutines';
import {SettingsState} from '../reducers/settings';
import {sendGoalTargetNotification} from '../helpers/goals';

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
    const {profile, weeklyItems}: ProfileState = yield select(
      (state: MyRootState) => state.profile,
    );
    yield call(api.saveQuickRoutine, action.payload);
    if (action.payload.saved) {
      yield call(Snackbar.show, {text: 'Workout saved '});
    }
    if (profile.goal) {
      const {quickRoutines}: QuickRoutinesState = yield select(
        (state: MyRootState) => state.quickRoutines,
      );

      const settings: SettingsState = yield select(
        (state: MyRootState) => state.settings,
      );

      sendGoalTargetNotification(
        action.payload,
        profile.goal,
        weeklyItems,
        quickRoutines,
        settings,
      );
    }
  } catch (e) {
    logError(e);
    yield call(Snackbar.show, {text: 'Error saving workout'});
  }
}

export function* getSavedQuickRoutines() {
  try {
    yield put(setLoading(true));
    const savedQuickRoutines: {[key: string]: SavedQuickRoutine} = yield call(
      api.getSavedQuickRoutines,
    );
    yield put(setSavedQuickRoutine(savedQuickRoutines));
    const quickRoutines: {[key: string]: QuickRoutine} = yield select(
      (state: MyRootState) => state.quickRoutines.quickRoutines,
    );
    const missingRoutines = Object.values(savedQuickRoutines)
      .filter(routine => !quickRoutines[routine.quickRoutineId])
      .map(routine => routine.quickRoutineId);

    if (missingRoutines.length) {
      yield call(getQuickRoutinesById, {
        payload: missingRoutines,
        type: GET_QUICK_ROUTINES_BY_ID,
      });
    }
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
