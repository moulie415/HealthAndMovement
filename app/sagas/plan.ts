import Snackbar from 'react-native-snackbar';
import {eventChannel, EventChannel} from 'redux-saga';
import {
  all,
  call,
  fork,
  put,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects';
import * as _ from 'lodash';
import {GET_PLAN, setPlan} from '../actions/plan';
import {
  SET_TEST_REMINDERS,
  SET_WORKOUT_REMINDERS,
  SET_WORKOUT_REMINDER_TIME,
} from '../actions/profile';
import {logError} from '../helpers/error';
import Profile from '../types/Profile';
import {MyRootState, Plan} from '../types/Shared';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';
import {scheduleLocalNotification} from '../helpers';
import {
  TEST_REMINDERS_CHANNEL_ID,
  WORKOUT_REMINDERS_CHANNEL_ID,
} from './profile';
import moment from 'moment';

export function* schedulePlanReminders() {
  PushNotification.cancelAllLocalNotifications();
  const plan: Plan | undefined = yield select(
    (state: MyRootState) => state.profile.plan,
  );
  const {testReminders, workoutReminders, reminderTime, testReminderTime} =
    yield select((state: MyRootState) => state.profile);
  if (plan) {
    if (plan.workouts && workoutReminders) {
      plan.workouts.forEach(workout => {
        workout.dates.forEach(d => {
          const date = moment(d)
            .set('hours', moment(reminderTime).hours())
            .set('minutes', moment(reminderTime).minutes());
          if (date.isAfter(moment())) {
            scheduleLocalNotification(
              'Reminder to do your workout for today',
              date.toDate(),
              WORKOUT_REMINDERS_CHANNEL_ID,
            );
          }
        });
      });
    }
    // if (plan.tests && testReminders) {
    //   plan.tests.forEach(test => {
    //     test.dates.forEach(d => {
    //       const date = moment(d)
    //         .set('hours', moment(testReminderTime).hours())
    //         .set('minutes', moment(testReminderTime).minutes());
    //       if (date.isAfter(moment())) {
    //         scheduleLocalNotification(
    //           'Reminder to do your fitness test for today',
    //           date.toDate(),
    //           TEST_REMINDERS_CHANNEL_ID,
    //         );
    //       }
    //     });
    //   });
    // }
  }
}

function onPlanChanged(uid: string) {
  return eventChannel(emitter => {
    const subscriber = db()
      .collection('plans')
      .where('user', '==', uid)
      .orderBy('createdate')
      .limitToLast(1)
      .onSnapshot(
        snapshot => {
          if (snapshot.docs[0]) {
            emitter({
              ...snapshot.docs[0].data(),
              id: snapshot.docs[0].id,
              createdate: snapshot.docs[0].data().createdate?.toDate(),
              lastupdate: snapshot.docs[0].data().lastupdate?.toDate(),
            });
          } else {
            emitter({});
          }
        },
        error => {
          logError(error);
        },
      );
    return subscriber;
  });
}

function* planWatcher() {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const channel: EventChannel<Plan> = yield call(onPlanChanged, uid);
    while (true) {
      const plan: Plan | {} = yield take(channel);
      const current: Plan = yield select(
        (state: MyRootState) => state.profile.plan,
      );
      if (_.isEmpty(plan)) {
        yield put(setPlan(undefined));
      } else {
        if (
          current &&
          !_.isEqual(
            _.omit(current, ['lastupdate', 'createdate']),
            _.omit(plan, ['lastupdate', 'createdate']),
          )
        ) {
          Snackbar.show({text: 'Your plan has been updated'});
        }
        yield put(setPlan(plan as Plan));
      }
      yield call(schedulePlanReminders);
    }
  } catch (e) {
    logError(e);
  }
}

function* getPlanWorker() {
  try {
    yield fork(planWatcher);
  } catch (e) {
    logError(e);
  }
}

export default function* planSaga() {
  yield all([
    takeLatest(GET_PLAN, getPlanWorker),
    takeLatest(SET_WORKOUT_REMINDERS, schedulePlanReminders),
    takeLatest(SET_WORKOUT_REMINDER_TIME, schedulePlanReminders),
    takeLatest(SET_TEST_REMINDERS, schedulePlanReminders),
    takeLatest(SET_TEST_REMINDERS, schedulePlanReminders),
  ]);
}
