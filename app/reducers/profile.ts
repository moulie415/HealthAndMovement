import {AppState, AppStateStatus} from 'react-native';
import Chat from '../types/Chat';
import Message from '../types/Message';
import Profile from '../types/Profile';
import {SavedQuickRoutine, SavedTest, SavedWorkout} from '../types/SavedItem';
import {
  Plan,
  Sample,
  SignUpPayload,
  StepSample,
  UpdateProfilePayload,
} from '../types/Shared';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {PurchasesEntitlementInfo} from 'react-native-purchases';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export interface WeeklyItems {
  quickRoutines: {[key: string]: SavedQuickRoutine};
  tests: {[key: string]: SavedTest};
  workouts: {[key: string]: SavedWorkout};
}

export interface ProfileState {
  step: number;
  profile: Profile;
  loggedIn: boolean;
  weightSamples: Sample[];
  heightSamples: Sample[];
  bodyFatPercentageSamples: Sample[];
  muscleMassSamples: Sample[];
  boneMassSamples: Sample[];
  stepSamples: StepSample[];
  weeklySteps: StepSample[];
  connections: {[key: string]: Profile};
  connectionWeeklyItems: {[key: string]: WeeklyItems};
  loading: boolean;
  messages: {[key: string]: {[key: string]: Message}};
  chats: {[key: string]: Chat};
  chatMessages: {[key: string]: string};
  state: AppStateStatus;
  weeklyItems: WeeklyItems;
  plan?: Plan;
  hasViewedTour: boolean;
  syncedPlanEvents: {[key: string]: string};
  calendarId?: string;
  loginEmail: string;
  loginPassword: string;
}

const initialState: ProfileState = {
  step: 0,
  profile: {
    email: '',
    uid: '',
    unread: {},
    premium: false,
    workoutReminders: true,
    workoutReminderTime: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1,
      9,
      0,
      0,
    ).toISOString(),
    testReminderTime: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 1,
      9,
      0,
      0,
    ).toISOString(),
    testReminders: true,
    syncPlanWithCalendar: false,
    autoPlay: true,
    prepTime: 15,
    workoutMusic: true,
  },
  loggedIn: false,
  weightSamples: [],
  heightSamples: [],
  bodyFatPercentageSamples: [],
  muscleMassSamples: [],
  boneMassSamples: [],
  stepSamples: [],
  weeklySteps: [],
  connections: {},
  connectionWeeklyItems: {},
  loading: false,
  messages: {},
  chats: {},
  chatMessages: {},
  state: AppState.currentState,
  weeklyItems: {
    quickRoutines: {},
    tests: {},
    workouts: {},
  },
  hasViewedTour: false,
  syncedPlanEvents: {},
  loginEmail: '',
  loginPassword: '',
};

export const PROFILE = 'profile';
export type PROFILE = typeof PROFILE;

export const SET_PROFILE = `${PROFILE}/setProfile`;
export type SET_PROFILE = typeof SET_PROFILE;

export const SET_LOGGED_IN = `${PROFILE}/setLoggedIn`;
export type SET_LOGGED_IN = typeof SET_LOGGED_IN;

export const SIGN_UP = `${PROFILE}/signUp`;
export type SIGN_UP = typeof SIGN_UP;

export const GET_SAMPLES = `${PROFILE}/getSamples`;
export type GET_SAMPLES = typeof GET_SAMPLES;

export const SET_WEIGHT_SAMPLES = `${PROFILE}/setWeightSamples`;
export type SET_WEIGHT_SAMPLES = typeof SET_WEIGHT_SAMPLES;

export const SET_HEIGHT_SAMPLES = `${PROFILE}/setHeightSamples`;
export type SET_HEIGHT_SAMPLES = typeof SET_HEIGHT_SAMPLES;

export const SET_BODY_FAT_PERCENTAGE_SAMPLES = `${PROFILE}/setBodyFatPercentageSamples`;
export type SET_BODY_FAT_PERCENTAGE_SAMPLES =
  typeof SET_BODY_FAT_PERCENTAGE_SAMPLES;

export const SET_MUSCLE_MASS_SAMPLES = `${PROFILE}/setMuscleMassSamples`;
export type SET_MUSCLE_MASS_SAMPLES = typeof SET_MUSCLE_MASS_SAMPLES;

export const SET_BONE_MASS_SAMPLES = `${PROFILE}/setBoneMassSamples`;
export type SET_BONE_MASS_SAMPLES = typeof SET_BONE_MASS_SAMPLES;

export const SET_STEP_SAMPLES = `${PROFILE}/setStepSamples`;
export type SET_STEP_SAMPLES = typeof SET_STEP_SAMPLES;

export const SET_WEEKLY_STEPS = `${PROFILE}/setWeeklySteps`;
export type SET_WEEKLY_STEPS = typeof SET_WEEKLY_STEPS;

export const UPDATE_PROFILE = `${PROFILE}/updateProfile`;
export type UPDATE_PROFILE = typeof UPDATE_PROFILE;

export const HANDLE_AUTH = `${PROFILE}/handleAuth`;
export type HANDLE_AUTH = typeof HANDLE_AUTH;

export const SET_PREMIUM = `${PROFILE}/setPremium`;
export type SET_PREMIUM = typeof SET_PREMIUM;

export const SET_ADMIN = `${PROFILE}/setAdmin`;
export type SET_ADMIN = typeof SET_ADMIN;

export const GET_CONNECTIONS = `${PROFILE}/getConnections`;
export type GET_CONNECTIONS = typeof GET_CONNECTIONS;

export const SET_CONNECTIONS = `${PROFILE}/setConnections`;
export type SET_CONNECTIONS = typeof SET_CONNECTIONS;

export const SET_LOADING = `${PROFILE}/setLoading`;
export type SET_LOADING = typeof SET_LOADING;

export const SET_MESSAGES = `${PROFILE}/setMessages`;
export type SET_MESSAGES = typeof SET_MESSAGES;

export const SET_CHATS = `${PROFILE}/setChats`;
export type SET_CHATS = typeof SET_CHATS;

export const SEND_MESSAGE = `${PROFILE}/sendMessage`;
export type SEND_MESSAGE = typeof SEND_MESSAGE;

export const SET_MESSAGE = `${PROFILE}/setMessage`;
export type SET_MESSAGE = typeof SET_MESSAGE;

export const SET_READ = `${PROFILE}/setRead`;
export type SET_READ = typeof SET_READ;

export const SET_UNREAD = `${PROFILE}/setUnread`;
export type SET_UNREAD = typeof SET_UNREAD;

export const SET_PLAN_READ = `${PROFILE}/setPlanRead`;
export type SET_PLAN_READ = typeof SET_PLAN_READ;

export const SET_PLAN_UNREAD = `${PROFILE}/setPlanUnread`;
export type SET_PLAN_UNREAD = typeof SET_PLAN_UNREAD;

export const SET_APP_STATE = `${PROFILE}/setAppState`;
export type SET_APP_STATE = typeof SET_APP_STATE;

export const LOAD_EARLIER_MESSAGES = `${PROFILE}/loadEarlierMessages`;
export type LOAD_EARLIER_MESSAGES = typeof LOAD_EARLIER_MESSAGES;

export const SET_VIEWED_PLAN = `${PROFILE}/setViewedPlan`;
export type SET_VIEWED_PLAN = typeof SET_VIEWED_PLAN;

export const GET_WEEKLY_ITEMS = `${PROFILE}/getWeeklyItems`;
export type GET_WEEKLY_ITEMS = typeof GET_WEEKLY_ITEMS;

export const SET_WEEKLY_ITEMS = `${PROFILE}/setWeeklyItems`;
export type SET_WEEKLY_ITEMS = typeof SET_WEEKLY_ITEMS;

export const GET_WEEKLY_ITEMS_FOR_CONNECTION = `${PROFILE}/getWeeklyItemsForConnection`;
export type GET_WEEKLY_ITEMS_FOR_CONNECTION =
  typeof GET_WEEKLY_ITEMS_FOR_CONNECTION;

export const SET_WEEKLY_ITEMS_FOR_CONNECTION = `${PROFILE}/setWeeklyItemsForConnection`;
export type SET_WEEKLY_ITEMS_FOR_CONNECTION =
  typeof SET_WEEKLY_ITEMS_FOR_CONNECTION;

export const SET_HAS_VIEWED_TOUR = `${PROFILE}/setHasViewedTour`;
export type SET_HAS_VIEWED_TOUR = typeof SET_HAS_VIEWED_TOUR;

export const SET_CHAT_MESSAGE = `${PROFILE}/setChatMessage`;
export type SET_CHAT_MESSAGE = typeof SET_CHAT_MESSAGE;

export const SET_LOGIN_EMAIL = `${PROFILE}/setLoginEmail`;
export type SET_LOGIN_EMAIL = typeof SET_LOGIN_EMAIL;

export const SET_LOGIN_PASSWORD = `${PROFILE}/setLoginPassword`;
export type SET_LOGIN_PASSWORD = typeof SET_LOGIN_PASSWORD;

export const SET_CALENDAR_ID = `${PROFILE}/setCalendarId`;
export type SET_CALENDAR_ID = typeof SET_CALENDAR_ID;

export const GET_PLAN = `${PROFILE}/getPlan`;
export type GET_PLAN = typeof GET_PLAN;

export const SET_PLAN = `${PROFILE}/setPlan`;
export type SET_PLAN = typeof SET_PLAN;

export const SYNC_PLAN_WITH_CALENDAR = `${PROFILE}/syncPlanWithCalendar`;
export type SYNC_PLAN_WITH_CALENDAR = typeof SYNC_PLAN_WITH_CALENDAR;

export const SET_SYNCED_PLAN_EVENT = `${PROFILE}/setSyncedPlanEvent`;
export type SET_SYNCED_PLAN_EVENT = typeof SET_SYNCED_PLAN_EVENT;

const profileSlice = createSlice({
  name: PROFILE,
  initialState,
  reducers: {
    setProfile: (state: ProfileState, {payload}: PayloadAction<Profile>) => {
      state.profile = payload;
    },
    setLoggedIn: (state: ProfileState, {payload}: PayloadAction<boolean>) => {
      if (payload) {
        state.loggedIn = payload;
      } else {
        const loginEmail = state.loginEmail;
        const loginPassword = state.loginPassword;
        return {...initialState, loginEmail, loginPassword};
      }
    },
    setWeightSamples: (
      state: ProfileState,
      {payload}: PayloadAction<Sample[]>,
    ) => {
      state.weightSamples = payload;
    },
    setHeightSamples: (
      state: ProfileState,
      {payload}: PayloadAction<Sample[]>,
    ) => {
      state.heightSamples = payload;
    },
    setBodyFatPercentageSamples: (
      state: ProfileState,
      {payload}: PayloadAction<Sample[]>,
    ) => {
      state.bodyFatPercentageSamples = payload;
    },
    setMuscleMassSamples: (
      state: ProfileState,
      {payload}: PayloadAction<Sample[]>,
    ) => {
      state.muscleMassSamples = payload;
    },
    setBoneMassSamples: (
      state: ProfileState,
      {payload}: PayloadAction<Sample[]>,
    ) => {
      state.boneMassSamples = payload;
    },
    setStepSamples: (
      state: ProfileState,
      {payload}: PayloadAction<StepSample[]>,
    ) => {
      state.stepSamples = payload;
    },
    setWeeklySteps: (
      state: ProfileState,
      {payload}: PayloadAction<StepSample[]>,
    ) => {
      state.weeklySteps = payload;
    },
    setPremium: (
      state: ProfileState,
      {
        payload,
      }: PayloadAction<false | {[key: string]: PurchasesEntitlementInfo}>,
    ) => {
      state.profile = {...state.profile, premium: payload};
    },
    setAdmin: (state: ProfileState, {payload}: PayloadAction<boolean>) => {
      state.profile = {...state.profile, admin: payload};
    },
    setConnections: (
      state: ProfileState,
      {payload}: PayloadAction<{[key: string]: Profile}>,
    ) => {
      state.connections = payload;
    },
    setLoading: (state: ProfileState, {payload}: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setMessages: (
      state: ProfileState,
      {
        payload,
      }: PayloadAction<{
        uid: string;
        snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
      }>,
    ) => {
      const messages = payload.snapshot.docs.reduce(
        (acc: {[id: string]: Message}, cur) => {
          const message: any = cur.data();
          acc[message ? message._id : cur.id] = {...message, id: cur.id};
          return acc;
        },
        {},
      );
      state.messages = {
        ...state.messages,
        [payload.uid]: {
          ...state.messages[payload.uid],
          ...messages,
        },
      };
    },
    setMessagesObj: (
      state: ProfileState,
      {
        payload,
      }: PayloadAction<{uid: string; messages: {[key: string]: Message}}>,
    ) => {
      state.messages = {
        ...state.messages,
        [payload.uid]: {
          ...state.messages[payload.uid],
          ...payload.messages,
        },
      };
    },
    setChats: (
      state: ProfileState,
      {payload}: PayloadAction<{[key: string]: Chat}>,
    ) => {
      state.chats = {...state.chats, ...payload};
    },

    setMessage: (
      state: ProfileState,
      {payload}: PayloadAction<{uid: string; message: Message}>,
    ) => {
      state.messages = {
        ...state.messages,
        [payload.uid]: {
          ...state.messages[payload.uid],
          [payload.message._id]: payload.message,
        },
      };
    },
    setUnread: (
      state: ProfileState,
      {payload}: PayloadAction<{[key: string]: number}>,
    ) => {
      state.profile = {...state.profile, unread: payload};
    },
    setRead: (state: ProfileState, {payload}: PayloadAction<string>) => {
      state.profile = {
        ...state.profile,
        unread: {...state.profile.unread, [payload]: 0},
      };
    },
    setAppState: (
      state: ProfileState,
      {payload}: PayloadAction<AppStateStatus>,
    ) => {
      state.state = payload;
    },
    setWeeklyItems: (
      state: ProfileState,
      {payload}: PayloadAction<WeeklyItems>,
    ) => {
      state.weeklyItems = payload;
    },
    setWeeklyItemsForConnection: (
      state: ProfileState,
      {payload}: PayloadAction<{items: WeeklyItems; uid: string}>,
    ) => {
      state.connectionWeeklyItems = {
        ...state.connectionWeeklyItems,
        [payload.uid]: payload.items,
      };
    },
    setPlan: (
      state: ProfileState,
      {payload}: PayloadAction<Plan | undefined>,
    ) => {
      state.plan = payload;
    },
    setHasViewedTour: (state: ProfileState) => {
      state.hasViewedTour = true;
    },
    setSyncedPlanEvent: (
      state: ProfileState,
      {payload}: PayloadAction<{key: string; id: string}>,
    ) => {
      state.syncedPlanEvents = {
        ...state.syncedPlanEvents,
        [payload.key]: payload.id,
      };
    },
    setCalendarId: (state: ProfileState, {payload}: PayloadAction<string>) => {
      state.calendarId = payload;
    },
    setChatMessage: (
      state: ProfileState,
      {payload}: PayloadAction<{uid: string; message: string}>,
    ) => {
      state.chatMessages = {
        ...state.chatMessages,
        [payload.uid]: payload.message,
      };
    },
    setLoginEmail: (state: ProfileState, {payload}: PayloadAction<string>) => {
      state.loginEmail = payload;
    },
    setLoginPassword: (
      state: ProfileState,
      {payload}: PayloadAction<string>,
    ) => {
      state.loginPassword = payload;
    },
    getWeeklyItems: () => {},
    getWeeklyItemsForConnection: (
      state: ProfileState,
      {payload}: PayloadAction<string>,
    ) => {},
    loadEarlierMessages: (
      state: ProfileState,
      {
        payload,
      }: PayloadAction<{chatId: string; uid: string; startAfter: number}>,
    ) => {},
    sendMessage: (
      state: ProfileState,
      {payload}: PayloadAction<{chatId: string; uid: string; message: Message}>,
    ) => {},
    getConnections: () => {},
    handleAuth: (
      state: ProfileState,
      {payload}: PayloadAction<FirebaseAuthTypes.User>,
    ) => {},
    getSamples: () => {},
    signUp: (
      state: ProfileState,
      {payload}: PayloadAction<SignUpPayload>,
    ) => {},
    updateProfile: (
      state: ProfileState,
      {payload}: PayloadAction<UpdateProfilePayload>,
    ) => {},
    getPlan: () => {},
    syncPlanWithCalendar: (
      state: ProfileState,
      {payload}: PayloadAction<{plan: Plan; sync: boolean}>,
    ) => {},
  },
});

export const {
  setAdmin,
  setAppState,
  setBodyFatPercentageSamples,
  setBoneMassSamples,
  setCalendarId,
  setChatMessage,
  setChats,
  setConnections,
  setHasViewedTour,
  setHeightSamples,
  setLoading,
  setLoggedIn,
  setLoginEmail,
  setLoginPassword,
  setMessage,
  setMessages,
  setMuscleMassSamples,
  setPlan,
  setPremium,
  setProfile,
  setStepSamples,
  setSyncedPlanEvent,
  setUnread,
  setWeeklyItems,
  setWeeklyItemsForConnection,
  setWeeklySteps,
  setWeightSamples,
  getConnections,
  getPlan,
  getSamples,
  getWeeklyItems,
  getWeeklyItemsForConnection,
  handleAuth,
  sendMessage,
  signUp,
  syncPlanWithCalendar,
  loadEarlierMessages,
  updateProfile,
  setMessagesObj,
  setRead,
} = profileSlice.actions;

export default profileSlice.reducer;
