import * as Sentry from '@sentry/react-native';

export const logError = (e: Error) => {
  if (__DEV__) {
    console.error(e);
  }
  Sentry.captureException(e);
};
