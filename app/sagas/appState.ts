import {AppState, AppStateStatus} from 'react-native';
import {eventChannel, EventChannel} from 'redux-saga';
import {call, put, take} from 'redux-saga/effects';
import {setAppState} from '../reducers/profile';

function onAppStateChanged() {
  return eventChannel(emitter => {
    const subscriber = AppState.addEventListener('change', nextAppState => {
      emitter(nextAppState);
    });
    return () => {
      subscriber.remove();
    };
  });
}

export default function* appStateSaga() {
  const channel: EventChannel<AppStateStatus> = yield call(onAppStateChanged);
  while (true) {
    const state: AppStateStatus = yield take(channel);
    yield put(setAppState(state));
  }
}
