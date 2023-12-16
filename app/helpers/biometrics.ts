import {Alert, Linking, Platform} from 'react-native';
import AppleHealthKit, {HealthValue} from 'react-native-health';
import GoogleFit, {
  ActivityType,
  BucketUnit,
  HeartRateResponse,
} from 'react-native-google-fit';
import moment from 'moment';
import {googleFitOptions, healthKitOptions} from '../constants/strings';
import {Gender, Unit} from '../types/Profile';
import {StepSample} from '../types/Shared';
import {logError} from './error';
import db from '@react-native-firebase/firestore';
import * as api from './api';

export const isAvailable = () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.isAvailable((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  return new Promise(resolve => {
    GoogleFit.isAvailable((isError, result) => {
      resolve(result);
    });
  });
};

export const isEnabled = () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.isAvailable((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  return new Promise((resolve, reject) => {
    GoogleFit.isEnabled((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const linkToGoogleFit = () => {
  return Linking.openURL('market://details?id=com.google.android.apps.fitness');
};

const round = (num: number) => {
  return Math.round(num * 100) / 100;
};

export const initBiometrics = async () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(healthKitOptions, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    });
  }
  const result = await GoogleFit.authorize(googleFitOptions);
  if (!result.success) {
    throw Error('Error authorizing google fit');
  }
};

export const getHeight = async (): Promise<number | undefined> => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      AppleHealthKit.getLatestHeight(null, (e, result) => {
        if (e) {
          reject(e);
        } else {
          if (result.value && typeof result.value === 'number') {
            // values is in inches so need to convert to cm
            resolve(round(result.value * 2.54));
          } else {
            resolve(undefined);
          }
        }
      });
    });
  }
  const response = await GoogleFit.getHeightSamples({
    startDate: moment().subtract(30, 'days').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });
  const latest = response[response.length - 1];
  if (latest && latest.value && typeof latest.value === 'number') {
    // value is in metres so need to convert to cm
    return round(latest.value * 100);
  }
};

export const getWeight = async (): Promise<number | undefined> => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      AppleHealthKit.getLatestWeight(null, (e, result) => {
        if (e) {
          reject(e);
        } else {
          if (result.value && typeof result.value === 'number') {
            // value is in pounds so need to convert to kg
            resolve(round(result.value * 0.453592));
          } else {
            resolve(undefined);
          }
        }
      });
    });
  }
  const response = await GoogleFit.getWeightSamples({
    startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });
  const latest = response[response.length - 1];
  if (latest && latest.value && typeof latest.value === 'number') {
    // value is in kg so no need to convert
    return round(latest.value);
  }
};

export const getWeightSamples = async (unit: Unit) => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getWeightSamples(
        {
          startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
          endDate: moment().endOf('day').toISOString(),
          // @ts-ignore
          unit: unit === 'lbs' ? 'pound' : 'gram',
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              unit === 'imperial'
                ? results
                : results.map(result => {
                    return {...result, value: result.value / 1000};
                  }),
            );
          }
        },
      );
    });
  }
  const response = await GoogleFit.getWeightSamples({
    startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
    unit: unit === 'imperial' ? 'pound' : 'kg',
  });
  return response;
};

export const getHeightSamples = async (unit: Unit) => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getHeightSamples(
        {
          startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
          endDate: moment().endOf('day').toISOString(),
          // @ts-ignore
          unit: unit === 'imperial' ? 'inch' : 'meter',
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              unit === 'imperial'
                ? results
                : results.map(result => {
                    return {...result, value: result.value * 100};
                  }),
            );
          }
        },
      );
    });
  }
  const response = await GoogleFit.getHeightSamples({
    startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });
  return response.map(item => {
    return {...item, value: item.value * 100};
  });
};

export const getStepSamples = async () => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyStepCountSamples(
        {
          startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
          endDate: moment().endOf('day').toISOString(),
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        },
      );
    });
  }
  const response = await GoogleFit.getDailyStepCountSamples({
    startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
    bucketUnit: BucketUnit.DAY,
    bucketInterval: 1,
  });

  // difference between steps and rawSteps?
  return response.reduce((acc: {date: string; value: number}[], cur) => {
    return [...acc, ...cur.steps];
  }, []);
};

export const getWeeklySteps = async (): Promise<StepSample[]> => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return [];
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyStepCountSamples(
        {
          startDate: moment().subtract(1, 'week').startOf('day').toISOString(),
          endDate: moment().endOf('day').toISOString(),
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              results.map(result => {
                return {date: result.startDate, value: result.value};
              }),
            );
          }
        },
      );
    });
  }
  const response = await GoogleFit.getWeeklySteps();
  return response.reduce((acc: {date: string; value: number}[], cur) => {
    return [...acc, ...cur.steps];
  }, []);
};

export const getActivitySamples = async () => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getSamples(
        {
          startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
          endDate: moment().endOf('day').toISOString(),
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        },
      );
    });
  }
  const response = await GoogleFit.getActivitySamples({
    startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
    endDate: moment().endOf('day').toISOString(),
  });

  return response;
};

export const getSex = (): void | Promise<Gender | undefined> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      AppleHealthKit.getBiologicalSex(null, (e, result) => {
        if (e) {
          reject(e);
        }
        // @ts-ignore
        if (result.value === 'male' || result.value === 'female') {
          resolve(result.value);
        } else {
          resolve(undefined);
        }
      });
    });
  }
};

export const getDateOfBirth = (): void | Promise<string | undefined> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDateOfBirth(null, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result.value);
        }
      });
    });
  }
};

export const saveWeight = async (value?: number, unit = 'metric') => {
  if (!value || !unit) {
    return;
  }
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.saveWeight(
        {value: unit === 'metric' ? value * 2.20462 : value},
        (e, result) => {
          if (e) {
            reject(e);
          } else {
            resolve(result);
          }
        },
      );
    } else {
      GoogleFit.saveWeight(
        {
          value: unit === 'metric' ? value * 2.20462 : value,
          date: new Date().toISOString(),
          unit: 'pound',
        },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    }
  });
};

export const saveHeight = async (value?: number, unit = 'metric') => {
  if (!value || !unit) {
    return;
  }
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'ios') {
      AppleHealthKit.saveHeight(
        {value: unit === 'metric' ? value * 0.393701 : value},
        (e, result) => {
          if (e) {
            reject(e);
          } else {
            resolve(result);
          }
        },
      );
    } else {
      GoogleFit.saveHeight(
        {
          value: unit === 'metric' ? value / 100 : value * 0.0254,
          date: new Date().toISOString(),
        },
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
    }
  });
};

export const getHeartRateSamples = async (
  startDate: Date,
  endDate: Date,
): Promise<HealthValue[] | HeartRateResponse[]> => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getHeartRateSamples(
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        },
      );
    });
  }
  return GoogleFit.getHeartRateSamples({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    bucketUnit: BucketUnit.SECOND,
  });
};

export const saveWorkout = async (
  seconds: number,
  name: string,
  description: string,
  calories: number,
) => {
  if (!(await isAvailable()) || !(await isEnabled())) {
    return;
  }
  try {
    const startDate = moment().subtract(seconds, 'seconds').toISOString();
    const endDate = moment().toISOString();
    if (Platform.OS === 'ios') {
      return new Promise((resolve, reject) => {
        AppleHealthKit.saveWorkout(
          {
            type: AppleHealthKit.Constants.Activities
              .FunctionalStrengthTraining,
            startDate,
            endDate,
            // @ts-ignore
            energyBurned: calories,
            energyBurnedUnit: 'calorie',
          },
          (e: Error, res) => {
            if (e) {
              logError(e);
              reject(e);
              return;
            }
            resolve(res);
            // workout successfully saved
          },
        );
      });
    } else {
      return GoogleFit.saveWorkout({
        startDate: moment(startDate).toISOString(),
        endDate: moment(endDate).toISOString(),
        activityType: ActivityType.Strength_training,
        sessionName: name,
        identifier: `workout:${moment(startDate).toISOString()} - ${moment(
          endDate,
        ).toISOString()}`,
        calories,
        description,
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      Alert.alert(
        `Error saving workout to ${
          Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'
        }`,
        e.message,
      );
    }
  }
};

export const getBodyFatPercentageSamples = async () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getBodyFatPercentageSamples(
        {
          startDate: moment().subtract(1, 'year').startOf('day').toISOString(),
          endDate: moment().endOf('day').toISOString(),
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(
              results.map(res => {
                return {...res, value: res.value * 100};
              }),
            );
          }
        },
      );
    });
  } else {
    return api.getBodyFatPercentageSamples();
  }
};

export const saveBodyFatPercentage = async (value: number) => {
  await api.saveBodyFatPercentage(value);
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      AppleHealthKit.saveBodyFatPercentage({value}, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    });
  }
};

export const getMuscleMassSamples = async () => {
  return api.getMuscleMassSamples();
};

export const saveMuscleMass = (value: number) => {
  return api.saveMuscleMass(value);
};

export const getBoneMassSamples = async () => {
  return api.getBoneMassSamples();
};

export const saveBoneMass = (value: number) => {
  return api.saveBoneMass(value);
};
