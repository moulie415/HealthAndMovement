import {Platform} from 'react-native';
import {
  sendMessage,
  watchEvents,
  WatchPayload,
  getReachability,
} from 'react-native-watch-connectivity';
import {eventChannel, EventChannel} from 'redux-saga';
import {all, call, put, select, take, takeLatest} from 'redux-saga/effects';
import {MyRootState} from '../types/Shared';
import * as api from '../helpers/api';
import QuickRoutine from '../types/QuickRoutines';
import Exercise from '../types/Exercise';
import {
  SET_QUICK_ROUTINES,
  START_QUICK_ROUTINE,
} from '../reducers/quickRoutines';
import {SET_LOGGED_IN} from '../reducers/profile';
import {PayloadAction} from '@reduxjs/toolkit';

function* loggedInWorker(action: PayloadAction<boolean>) {
  const reachable: boolean = yield call(getReachability);
  if (reachable) {
    const loggedIn = action.payload;
    const routines: {[key: string]: QuickRoutine} = yield select(
      (state: MyRootState) => state.quickRoutines.quickRoutines,
    );
    const {premium} = yield select(
      (state: MyRootState) => state.profile.profile,
    );

    sendMessage({loggedIn, routines, premium}, error => {
      if (error) {
        console.error(error);
      }
    });
  }
}

function* setQuickRoutinesWorker(
  action: PayloadAction<{[key: string]: QuickRoutine}>,
) {
  const routines = action.payload;
  const reachable: boolean = yield call(getReachability);
  if (reachable) {
    sendMessage({routines}, error => {
      if (error) {
        console.error(error);
      }
    });
  }
}

function* startQuickRoutineWorker(
  action: PayloadAction<{id: string; exerciseIds: string[]}>,
) {
  const reachable: boolean = yield call(getReachability);
  const {id, exerciseIds} = action.payload;
  const {exercises} = yield select((state: MyRootState) => state.exercises);
  if (reachable) {
    const workout: Exercise[] = exerciseIds.map(e => exercises[e]);
    sendMessage({startQuickRoutine: {id}});
  }
}

interface MessageEvent {
  message: {[key: string]: any};
  reply: (resp: WatchPayload) => void;
}

function* messageHandler(event: MessageEvent) {
  if (event.message.isLoggedIn) {
    const {loggedIn} = yield select((state: MyRootState) => state.profile);
    const {premium} = yield select(
      (state: MyRootState) => state.profile.profile,
    );
    const routines: {[key: string]: QuickRoutine} = yield select(
      (state: MyRootState) => state.quickRoutines.quickRoutines,
    );
    event.reply({loggedIn, routines, premium});
  }
  if (event.message.getQuickRoutines) {
    const routines: {[key: string]: QuickRoutine} = yield call(
      api.getQuickRoutines,
    );
    event.reply({routines});
  }
}

function onMessage() {
  return eventChannel(emitter => {
    const unsubscribe = watchEvents.addListener('message', (message, reply) => {
      emitter({message, reply});
    });
    return unsubscribe;
  });
}

export default function* watchSaga() {
  if (Platform.OS === 'ios') {
    yield all([
      takeLatest(SET_LOGGED_IN, loggedInWorker),
      takeLatest(SET_QUICK_ROUTINES, setQuickRoutinesWorker),
      takeLatest(START_QUICK_ROUTINE, startQuickRoutineWorker),
    ]);

    const messageChannel: EventChannel<MessageEvent> = yield call(onMessage);
    while (true) {
      const event: MessageEvent = yield take(messageChannel);
      yield call(messageHandler, event);
    }
  }
}
