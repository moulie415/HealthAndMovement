import React, {useRef, useState} from 'react';
import reducer from './reducers';
import {Provider} from 'react-redux';
import Purchases, {LOG_LEVEL} from 'react-native-purchases';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {persistStore} from 'redux-persist';
import {applyMiddleware, configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from '@redux-saga/core';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import rootSaga from './sagas';
import {navigationRef} from './RootNavigation';
import SplashScreen from 'react-native-splash-screen';
import * as Sentry from '@sentry/react-native';
import {
  Goal,
  Level,
  Equipment as EquipmentItem,
  WarmUp,
  CoolDown,
  PlanNutrition,
  PlanSleep,
  PlanWorkout,
  ExerciseEvent,
  PauseEvent,
} from './types/Shared';
import ExerciseType from './types/Exercise';
import {useEffect} from 'react';
import QuickRoutine, {Area, Equipment} from './types/QuickRoutines';
import TestType from './types/Test';
import StackComponent, {DrawerNavigator} from './Stack';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import appCheck from '@react-native-firebase/app-check';
import Education from './types/Education';
import {
  Dimensions,
  Platform,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Config from 'react-native-config';
import MobileAds from 'react-native-google-mobile-ads';
import colors from './constants/colors';
import FastImage from 'react-native-fast-image';
import Profile from './types/Profile';

const {height, width} = Dimensions.get('window');

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer,
  middleware: [sagaMiddleware],
});

export const persistor = persistStore(store);

export type StackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  DeleteAccount: undefined;
  SignUpFlow: {fromProfile?: boolean};
  Tabs: undefined;
  Home: undefined;
  Exercise: {id: string};
  Fitness: undefined;
  Goals: undefined;
  Test: {id: string};
  FitnessGoal: undefined;
  Experience: undefined;
  WarmUp: undefined;
  ExerciseList: {
    goal: Goal;
    level: Level;
    equipment: EquipmentItem[];
    warmUp: WarmUp[];
    coolDown: CoolDown[];
  };
  CustomizeExercise: {exercise: ExerciseType};
  ReviewExercises: undefined;
  PreWorkout: {planWorkout: PlanWorkout; planId: string};
  StartWorkout: {planWorkout: PlanWorkout; startTime: Date; planId: string};
  EndWorkout: {
    seconds: number;
    planWorkout: PlanWorkout;
    endTime: Date;
    exerciseEvents: ExerciseEvent[];
    pauseEvents: PauseEvent[];
    startTime: Date;
    planId: string;
  };
  WorkoutSummary: {
    seconds: number;
    calories?: number;
    difficulty: number;
    averageHeartRate: number;
  };
  Education: undefined;
  EducationArticle: {education: Education};
  Settings: undefined;
  Profile: undefined;
  History: undefined;
  Notifications: undefined;
  Premium: {onActivated?: () => void};
  Support: undefined;
  Terms: undefined;
  Workout: undefined;
  About: undefined;
  Policies: undefined;
  Loading: undefined;
  QuickRoutines: undefined;
  PreQuickRoutine: {routine: QuickRoutine};
  QuickRoutine: {routine: QuickRoutine; startTime: Date};
  EndQuickRoutine: {
    routine: QuickRoutine;
    seconds: number;
    startTime: Date;
    endTime: Date;
    exerciseEvents: ExerciseEvent[];
    pauseEvents: PauseEvent[];
  };
  QuickRoutineSummary: {
    routine: QuickRoutine;
    seconds: number;
    calories?: number;
    difficulty: number;
    averageHeartRate: number;
  };
  SavedItems: undefined;
  Connections: undefined;
  AddConnection: undefined;
  Chat: {uid: string};
  Plan: undefined;
  WhatArea: {equipment: Equipment};
  WorkoutList: {area: Area; equipment: Equipment};
  Rating: undefined;
  Stack: undefined;
  Nutrition: {nutrition: PlanNutrition};
  Sleep: {sleep: PlanSleep};
  MonthlyDayView: {workouts: PlanWorkout[]; date: string; planId: string};
  ViewProfile: {connection: Profile};
};

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  environment: __DEV__ ? 'development' : 'production',
  dsn: 'https://451fc54217394f32ae7fa2e15bc1280e@o982587.ingest.sentry.io/5937794',
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      // ...
    }),
  ],
});

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 5500);
  }, []);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    Purchases.configure({
      apiKey:
        Platform.OS === 'ios'
          ? (Config.REVENUE_CAT_IOS_KEY as string)
          : (Config.REVENUE_CAT_ANDROID_KEY as string),
    });

    const rnfbProvider = appCheck().newReactNativeFirebaseAppCheckProvider();
    rnfbProvider.configure({
      android: {
        provider: __DEV__ ? 'debug' : 'playIntegrity',
        debugToken: Config.APP_CHECK_DEBUG_TOKEN,
      },
      apple: {
        provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
        debugToken: Config.APP_CHECK_DEBUG_TOKEN,
      },
    });

    appCheck().initializeAppCheck({
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });

    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
        console.log(adapterStatuses);
      });
  }, []);

  return (
    <PersistGate persistor={persistor}>
      <Provider store={store}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            sagaMiddleware.run(rootSaga);
            SplashScreen.hide();

            // Register the navigation container with the instrumentation
            routingInstrumentation.registerNavigationContainer(navigationRef);
          }}>
          <DrawerNavigator />
        </NavigationContainer>
        {showSplash && (
          <View
            style={{
              backgroundColor: colors.appWhite,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}>
            {Platform.OS === 'ios' ? (
              <Image
                source={require('./images/splash.gif')}
                style={{
                  height,
                  width: '75%',
                  backgroundColor: colors.appWhite,
                  alignSelf: 'center',
                }}
                resizeMode="contain"
              />
            ) : (
              <FastImage
                source={require('./images/splash.gif')}
                style={{
                  height,
                  width: '75%',
                  backgroundColor: colors.appWhite,
                  alignSelf: 'center',
                }}
                resizeMode="contain"
              />
            )}
          </View>
        )}
      </Provider>
    </PersistGate>
  );
};

export default gestureHandlerRootHOC(Sentry.wrap(App));
