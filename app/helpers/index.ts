import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import {Dimensions} from 'react-native';
import Rate, {AndroidMarket} from 'react-native-rate';
import analytics from '@react-native-firebase/analytics';
import Profile from '../types/Profile';
import {Sample} from '../types/Shared';

const {height, width} = Dimensions.get('window');

export const truncate = (str: string, n: number) => {
  if (!str) {
    return '';
  }
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

export const scheduleLocalNotification = (
  message: string,
  date: Date,
  id: string,
  channel: string,
  repeatType = 'day',
) => {
  try {
    const fixedDate = moment().isBefore(date)
      ? moment(date).set('seconds', 0).subtract(1, 'day').utc().toDate()
      : moment(date).set('seconds', 0).utc().toDate();

    PushNotification.cancelLocalNotification(`${id}`);
    PushNotification.localNotificationSchedule({
      message,
      date: fixedDate,
      // @ts-ignore
      id,
      // @ts-ignore
      repeatType,
      channelId: channel,
    });
    PushNotification.getScheduledLocalNotifications(callback =>
      console.log(callback),
    );
  } catch (e) {
    console.log(e.message);
  }
};

export const getWeightItems = (
  profile: Profile,
  monthlyWeightSamples: Sample[],
) => {
  const labels = [];
  const data = [];
  let prevWeight;
  let lowest = profile.weight || 0;
  let highest = profile.weight || 0;
  for (let i = 6; i >= 0; i--) {
    const day = moment().subtract(i, 'days');
    const dayOfYear = day.dayOfYear();
    const sample =
      monthlyWeightSamples &&
      monthlyWeightSamples.find(
        s => moment(s.startDate).dayOfYear() === dayOfYear,
      )?.value;
    if (i === 6) {
      const weight = sample || profile.weight || 0;
      if (weight > highest) {
        highest = weight;
      }
      if (weight < lowest) {
        lowest = weight;
      }
      data.push(weight);
      prevWeight = weight;
    } else {
      const weight = sample ?? prevWeight;
      data.push(weight);
      if (weight > highest) {
        highest = weight;
      }
      if (weight < lowest) {
        lowest = weight;
      }
    }
    labels.push(day.format('dd'));
  }
  return {data, labels, minMax: [lowest - 5, highest + 5]};
};

export const rateApp = () => {
  Rate.rate(
    {
      AppleAppID: '1506679389',
      GooglePackageName: 'com.healthandmovement',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
    },
    success => {
      analytics().logEvent('user_rating', {success});
    },
  );
};

export const getVideoHeight = () => {
  const screenRatio = height / width;
  return height / screenRatio;
};

export const quickRoutineTabString = (
  tab: number,
  key: 'area' | 'focus' | 'equipment',
) => {
  if (tab === 1) {
    if (key === 'area') {
      return 'Upper Body';
    }
    if (key === 'focus') {
      return 'Strength';
    }
    if (key === 'equipment') {
      return 'Full Equipment';
    }
  }
  if (tab === 2) {
    if (key === 'area') {
      return 'Lower Body';
    }
    if (key === 'focus') {
      return 'Mobility';
    }
    if (key === 'equipment') {
      return 'Minimal equipment';
    }
  }
  if (tab === 3) {
    if (key === 'area') {
      return 'Full body';
    }
    if (key === 'focus') {
      return 'Balance';
    }
    if (key === 'equipment') {
      return 'No equipment';
    }
  }
  if (key === 'area') {
    return 'Abs and core';
  }
  if (key === 'focus') {
    return 'High intensity';
  }
};
