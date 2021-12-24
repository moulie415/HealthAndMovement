import {all, fork} from 'redux-saga/effects';
import profileSaga from './profile';
import exercisesSaga from './exercises';
import testsSaga from './tests';
import quickRoutinesSaga from './quickRoutines';
import educationSaga from './education';

export default function* rootSaga() {
  yield all([
    fork(profileSaga),
    fork(exercisesSaga),
    fork(testsSaga),
    fork(quickRoutinesSaga),
    fork(educationSaga),
  ]);
}
