import {Scopes} from 'react-native-google-fit';
import AppleHealthKit, {HealthKitPermissions} from 'react-native-health';
const PERMS = AppleHealthKit.Constants.Permissions;

export default {
  spinner: 'MaterialIndicator',
  whiteSpaceRegex: /\s/,
  loremIpsum:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export const healthKitOptions: HealthKitPermissions = {
  permissions: {
    read: [
      PERMS.DateOfBirth,
      PERMS.Weight,
      PERMS.Height,
      PERMS.HeartRate,
      PERMS.Steps,
      PERMS.StepCount,
      PERMS.BiologicalSex,
      PERMS.Workout,
      PERMS.BodyFatPercentage,
      PERMS.ActiveEnergyBurned,
    ],
    write: [PERMS.Weight, PERMS.Workout, PERMS.Height, PERMS.BodyFatPercentage],
  },
};

export const googleFitOptions = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    // Scopes.FITNESS_LOCATION_READ,
    Scopes.FITNESS_ACTIVITY_WRITE,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_BODY_WRITE,
    Scopes.FITNESS_HEART_RATE_READ,
  ],
};

export const SAMPLE_VIDEO_LINK =
  'https://cdn.videvo.net/videvo_files/video/free/2014-08/large_watermarked/Earth_Zoom_In_preview.mp4';

export const WORKOUT_LISTENER_SETUP = 'healthKit:Workout:setup:success';
export const WORKOUT_LISTENER_SETUP_FAILURE = 'healthKit:Workout:setup:failure';
export const WORKOUT_LISTENER = 'healthKit:Workout:new';
