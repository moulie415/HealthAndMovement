import {call, put, select, takeEvery} from 'redux-saga/effects';
import Snackbar from 'react-native-snackbar';
import {
  AddExerciseAction,
  ADD_EXERCISE,
  DeleteExerciseAction,
  DELETE_EXERCISE,
  GetExercisesAction,
  GET_EXERCISES,
  setExercises,
  UpdateExerciseAction,
  UPDATE_EXERCISE,
} from '../actions/exercises';
import Exercise from '../types/Exercise';
import * as api from '../helpers/api';
import {MyRootState} from '../types/Shared';

export function* getExercises(action: GetExercisesAction) {
  const {level, goals, area} = action.payload;
  const exercises: {[key: string]: Exercise} = yield call(
    api.getExercises,
    level,
    goals,
    area,
  );
  yield put(setExercises(exercises));
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
  const ref = yield call(api.addExercise, exercise);
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
  yield call(getExercises);
  Snackbar.show({text: 'Exercise updated'});
}

export default function* exercisesSaga() {
  yield takeEvery(GET_EXERCISES, getExercises);
  yield takeEvery(ADD_EXERCISE, addExercise);
  yield takeEvery(DELETE_EXERCISE, deleteExercise);
  yield takeEvery(UPDATE_EXERCISE, updateExercise);
}
