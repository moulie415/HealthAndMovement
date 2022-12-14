import PushNotification from 'react-native-push-notification';
import moment, {Moment} from 'moment';
import {Dimensions} from 'react-native';
import Rate, {AndroidMarket} from 'react-native-rate';
import analytics from '@react-native-firebase/analytics';
import Profile from '../types/Profile';
import {Sample} from '../types/Shared';
import colors from '../constants/colors';
import {PercentileTable, Table} from '../types/Test';
import {Category} from '../types/Education';
import {logError} from './error';

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
  channel: string,
) => {
  try {
    PushNotification.localNotificationSchedule({
      message,
      date,
      channelId: channel,
    });
  } catch (e) {
    logError(e);
  }
};

const findClosestSampleToDate = (
  samples: Sample[],
  day: Moment,
  profileVal: number,
) => {
  let closest = Infinity;
  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    if (
      moment(sample.startDate).isSameOrAfter(day) &&
      moment(sample.startDate).diff(day) < closest
    ) {
      closest = sample.value;
    }
  }
  if (closest === Infinity) {
    return profileVal;
  }
  return closest;
};

export const getSampleItems = (
  profileVal: number,
  filter: 6 | 30 | 365,
  samples: Sample[],
) => {
  if (profileVal === undefined || profileVal === null) {
    const chartData = {
      labels: [] as string[],
      datasets: [
        {
          data: [] as number[],
          color: (opacity = 1) => colors.appBlue, // optional
          strokeWidth: 4, // optional
        },
        {
          data: [] as number[],
          color: () => 'rgba(0, 0, 0, 0)',
        },
      ],
    };
    return {data: [], chartData};
  }
  const labels = [];
  const data = [];

  let lowest = profileVal || 0;
  let highest = profileVal || 0;

  for (let i = filter as number; i >= 0; i--) {
    const day = moment().subtract(i, 'days').endOf('day');

    if (i === 0) {
      if (profileVal > highest) {
        highest = profileVal;
      }
      if (profileVal < lowest) {
        lowest = profileVal;
      }
      data.push(profileVal);
      if (filter === 6) {
        labels.push(day.format('dd'));
      }
      if (filter === 30) {
        labels.push(day.format('Do'));
      }
      if (filter === 365) {
        labels.push(day.format('MMM'));
      }
    } else if (
      i === filter ||
      filter === 6 ||
      (filter === 30 && i % 4 === 0) ||
      (filter === 365 && i % 50 === 0)
    ) {
      const sample =
        (samples &&
          samples.length &&
          findClosestSampleToDate(samples, day, profileVal)) ||
        profileVal;
      if (sample > highest) {
        highest = sample;
      }
      if (sample < lowest) {
        lowest = sample;
      }
      data.push(sample);

      if (filter === 6) {
        labels.push(day.format('dd'));
      }
      if (filter === 30) {
        labels.push(day.format('Do'));
      }
      if (filter === 365) {
        labels.push(day.format('MMM'));
      }
    }
  }

  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => colors.appBlue, // optional
        strokeWidth: 4, // optional
      },
      {
        data: [lowest - 5, highest + 5],
        color: () => 'rgba(0, 0, 0, 0)',
      },
    ],
  };

  return {data, chartData};
};

export const getBMIItems = (
  weight: number,
  height: number,
  weightSamples: Sample[],
  heightSamples: Sample[],
  filter: 6 | 30 | 365,
) => {
  // const labels = [];
  const data = [];

  let lowest = weight && height ? getBMI(height, weight) : 0;
  let highest = weight && height ? getBMI(height, weight) : 0;

  for (let i = filter as number; i >= 0; i--) {
    const day = moment().subtract(i, 'days').endOf('day');

    //if (i === 0) {
    //const bmi = getBMI(height, weight);
    // if (bmi > highest) {
    //   highest = bmi;
    // }
    // if (bmi < lowest) {
    //   lowest = bmi;
    // }
    // data.push(bmi);
    // if (filter === 6) {
    //   labels.push(day.format('dd'));
    // }
    // if (filter === 30) {
    //   labels.push(day.format('Do'));
    // }
    // if (filter === 365) {
    //   labels.push(day.format('MMM'));
    // }
    // } else if (
    //   i === filter ||
    //   filter === 6 ||
    //   (filter === 30 && i % 4 === 0) ||
    //   (filter === 365 && i % 50 === 0)
    // ) {
    const weightSample =
      (weightSamples &&
        weightSamples.length &&
        findClosestSampleToDate(weightSamples, day, weight)) ||
      weight;

    const heightSample =
      (heightSamples &&
        heightSamples.length &&
        findClosestSampleToDate(heightSamples, day, height)) ||
      height;
    const bmi = getBMI(heightSample, weightSample);
    if (bmi > highest) {
      highest = bmi;
    }
    if (bmi < lowest) {
      lowest = bmi;
    }
    data.push({y: bmi, x: day.valueOf()});

    // if (filter === 6) {
    //   labels.push(day.format('dd'));
    // }
    // if (filter === 30) {
    //   labels.push(day.format('Do'));
    // }
    // if (filter === 365) {
    //   labels.push(day.format('MMM'));
    // }
    // }
  }

  // const chartData = {
  //   labels,
  //   datasets: [
  //     {
  //       data,
  //       color: (opacity = 1) => colors.appBlue, // optional
  //       strokeWidth: 4, // optional
  //     },
  //     {
  //       data: [lowest - 5, highest + 5],
  //       color: () => 'rgba(0, 0, 0, 0)',
  //     },
  //   ],
  // };

  return {data /*chartData*/};
};

const getBMI = (h: number, w: number) => {
  const val = w / Math.pow(h / 100, 2);
  // convert to one decimal place
  return Math.round(val * 10) / 10;
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
      return 'Fitness';
    }
    if (key === 'equipment') {
      return 'Minimal equipment';
    }
  }
  if (tab === 3) {
    if (key === 'area') {
      return 'Full body';
    }
    if (key === 'equipment') {
      return 'No equipment';
    }
  }
  if (key === 'area') {
    return 'Abs and core';
  }
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getScoreIcon = (category: string) => {
  switch (category) {
    case 'excellent':
    case 'good':
    case 'aboveAverage':
    case '90th':
    case '80th':
    case '70th':
      return 'arrow-up';
    case 'average':
    case '60th':
    case '50th':
    case '40th':
      return '-';
    default:
      return 'arrow-down';
  }
};

export const getCategoryString = (category: string) => {
  if (category === 'aboveAverage') {
    return 'Above average';
  }
  if (category === 'belowAverage') {
    return 'Below Average';
  }
  if (category === 'veryPoor') {
    return 'Very poor';
  }
  return capitalizeFirstLetter(category);
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'excellent':
    case 'good':
    case 'aboveAverage':
    case '90th':
    case '80th':
    case '70th':
      return colors.appGreen;
    case 'average':
    case '60th':
    case '50th':
    case '40th':
      return colors.appBlue;
    default:
      return colors.appRed;
  }
};

export const getTableColumn = (table: Table, age: number) => {
  return (
    table &&
    Object.keys(table.age).find(c => {
      // @ts-ignore
      const values: Cell = table.age[c];
      if (
        (!values.higher || age <= Number(values.higher)) &&
        (!values.lower || age >= Number(values.lower))
      ) {
        return c;
      }
    })
  );
};

export const getTableCategory = (table: Table, col: string, score: number) => {
  return Object.keys(table).find(key => {
    if (key !== 'age') {
      // @ts-ignore
      const values: Cell = table[key][col];
      if (
        (!values.higher || score <= Number(values.higher)) &&
        (!values.lower || score >= Number(values.lower))
      ) {
        return key;
      }
    }
  });
};

export const getTableMax = (table: Table, col: string) => {
  let max = 0;
  Object.keys(table).forEach(key => {
    if (key !== 'age') {
      // @ts-ignore
      const values: Cell = table[key][col];
      if (values.higher && Number(values.higher) > max) {
        max = Number(values.higher);
      } else if (values.lower && Number(values.lower) > max) {
        max = Number(values.lower);
      }
    }
  });
  return max;
};

export const getTableAverage = (table: Table, col: string) => {
  // @ts-ignore
  return table.average[col];
};

export const getPercentile = (table: PercentileTable, score: number) => {
  let prevPercentile = 'bottom';
  for (let i = 1; i < 10; i++) {
    const percentile = `${i}0th`;
    // @ts-ignore
    const val = table[percentile];
    if (score < val) {
      return prevPercentile;
    }
    if (percentile === '90th') {
      return '90th';
    }
    prevPercentile = percentile;
  }
};

export const getPercentileFill = (percentile: string) => {
  switch (percentile) {
    case '90th':
      return 100;
    case '80th':
      return 90;
    case '70th':
      return 80;
    case '60th':
      return 70;
    case '50th':
      return 60;
    case '40th':
      return 50;
    case '30th':
      return 40;
    case '20th':
      return 30;
    case '10th':
      return 20;
    default:
      return 10;
  }
};

export const getEducationCategoryString = (category: Category) => {
  switch (category) {
    case Category.EXERCISE:
      return 'Education Articles';
    case Category.NUTRITIONAL:
      return 'Nutritional Info';
    default:
      return 'General Lifestyle';
  }
};

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function waitMilliseconds(ms: number) {
  await timeout(ms);
}

export const greetingMessage = () => {
  const currentHour = new Date().getHours();

  return currentHour >= 4 && currentHour < 12 // after 4:00AM and before 12:00PM
    ? 'Good morning'
    : currentHour >= 12 && currentHour <= 17 // after 12:00PM and before 6:00pm
    ? 'Good afternoon'
    : currentHour > 17 || currentHour < 4 // after 5:59pm or before 4:00AM (to accommodate night owls)
    ? 'Good evening' // if for some reason the calculation didn't work
    : 'Welcome';
};
