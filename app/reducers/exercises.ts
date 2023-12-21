import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import Exercise from '../types/Exercise';
import {Area} from '../types/QuickRoutines';
import {SavedWorkout} from '../types/SavedItem';
import {CoolDown, Equipment, Goal, Level, WarmUp} from '../types/Shared';
import {setLoggedIn} from './profile';

export interface ExercisesState {
  exercises: {[key: string]: Exercise};
  loading: boolean;
  workout: Exercise[];
  fitnessGoal: Goal;
  strengthArea: Area;
  level: Level;
  equipment: Equipment[];
  warmUp: WarmUp[];
  coolDown: CoolDown[];
  exerciseNotes: {[key: string]: string};
  workoutNotes: {[key: string]: string};
  videos: {[key: string]: {src: string; path: string}};
  videoLoading: boolean;
  savedWorkouts: {[key: string]: SavedWorkout};
  shareModalVisible: boolean;
}

const initialState: ExercisesState = {
  loading: false,
  exercises: {},
  workout: [],
  fitnessGoal: Goal.STRENGTH,
  strengthArea: 'upper',
  level: Level.BEGINNER,
  equipment: [Equipment.NONE],
  warmUp: [],
  coolDown: [],
  exerciseNotes: {},
  workoutNotes: {},
  videos: {},
  savedWorkouts: {},
  videoLoading: false,
  shareModalVisible: false,
};

export const EXERCISES = 'exercises';
export type EXERCISES = typeof EXERCISES;

export const GET_EXERCISES = `${EXERCISES}/getExercises`;
export type GET_EXERCISES = typeof GET_EXERCISES;

export const GET_EXERCISES_BY_ID = `${EXERCISES}/getExercisesById`;
export type GET_EXERCISES_BY_ID = typeof GET_EXERCISES_BY_ID;

export const SET_EXERCISES = `${EXERCISES}/setExercises`;
export type SET_EXERCISES = typeof SET_EXERCISES;

export const SET_LOADING = `${EXERCISES}/setLoading`;
export type SET_LOADING = typeof SET_LOADING;

export const SET_WORKOUT = `${EXERCISES}/setWorkout`;
export type SET_WORKOUT = typeof SET_WORKOUT;

export const SAVE_WORKOUT = `${EXERCISES}/saveWorkout`;
export type SAVE_WORKOUT = typeof SAVE_WORKOUT;

export const GET_SAVED_WORKOUTS = `${EXERCISES}/getSavedWorkouts`;
export type GET_SAVED_WORKOUTS = typeof GET_SAVED_WORKOUTS;

export const SET_SAVED_WORKOUTS = `${EXERCISES}/setSavedWorkout`;
export type SET_SAVED_WORKOUTS = typeof SET_SAVED_WORKOUTS;

export const SET_FITNESS_GOAL = `${EXERCISES}/setFitnessGoal`;
export type SET_FITNESS_GOAL = typeof SET_FITNESS_GOAL;

export const SET_STRENGTH_AREA = `${EXERCISES}/setStrengthArea`;
export type SET_STRENGTH_AREA = typeof SET_STRENGTH_AREA;

export const SET_LEVEL = `${EXERCISES}/setLevel`;
export type SET_LEVEL = typeof SET_LEVEL;

export const SET_EQUIPMENT = `${EXERCISES}/setEquipment`;
export type SET_EQUIPMENT = typeof SET_EQUIPMENT;

export const SET_WARM_UP = `${EXERCISES}/setWarmUp`;
export type SET_WARM_UP = typeof SET_WARM_UP;

export const SET_COOL_DOWN = `${EXERCISES}/setCoolDown`;
export type SET_COOL_DOWN = typeof SET_COOL_DOWN;

export const SET_SHARE_MODAL_VISIBLE = `${EXERCISES}/setShareModalVisible`;
export type SET_SHARE_MODAL_VISIBLE = typeof SET_SHARE_MODAL_VISIBLE;

export const VIEW_WORKOUT = `${EXERCISES}/viewWorkout`;
export type VIEW_WORKOUT = typeof VIEW_WORKOUT;

const exerciseSlice = createSlice({
  name: EXERCISES,
  initialState,
  reducers: {
    setExercises: (
      state: ExercisesState,
      {payload}: PayloadAction<{[key: string]: Exercise}>,
    ) => {
      state.exercises = {...state.exercises, ...payload};
    },
    setLoading: (state: ExercisesState, {payload}: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setWorkout: (
      state: ExercisesState,
      {payload}: PayloadAction<Exercise[]>,
    ) => {
      state.workout = payload;
    },
    setSavedWorkouts: (
      state: ExercisesState,
      {payload}: PayloadAction<{[key: string]: SavedWorkout}>,
    ) => {
      state.savedWorkouts = {...state.savedWorkouts, ...payload};
    },
    setFitnessGoal: (state: ExercisesState, {payload}: PayloadAction<Goal>) => {
      state.fitnessGoal = payload;
    },
    setStrengthArea: (
      state: ExercisesState,
      {payload}: PayloadAction<Area>,
    ) => {
      state.strengthArea = payload;
    },
    setLevel: (state: ExercisesState, {payload}: PayloadAction<Level>) => {
      state.level = payload;
    },
    setEquipment: (
      state: ExercisesState,
      {payload}: PayloadAction<Equipment[]>,
    ) => {
      state.equipment = payload;
    },
    setWarmUp: (state: ExercisesState, {payload}: PayloadAction<WarmUp[]>) => {
      state.warmUp = payload;
    },
    setCoolDown: (
      state: ExercisesState,
      {payload}: PayloadAction<CoolDown[]>,
    ) => {
      state.coolDown = payload;
    },
    setShareModalVisible: (
      state: ExercisesState,
      {payload}: PayloadAction<boolean>,
    ) => {
      state.shareModalVisible = payload;
    },
    viewWorkout: (
      state: ExercisesState,
      {payload}: PayloadAction<string[]>,
    ) => {},
    getExercises: (
      state: ExercisesState,
      {
        payload,
      }: PayloadAction<{
        level: Level;
        goal: Goal;
        warmUp: WarmUp[];
        coolDown: CoolDown[];
      }>,
    ) => {},
    getExercisesById: (
      state: ExercisesState,
      {payload}: PayloadAction<string[]>,
    ) => {},
    saveWorkout: (
      state: ExercisesState,
      {payload}: PayloadAction<SavedWorkout>,
    ) => {},
    getSavedWorkouts: () => {},
  },
  extraReducers: builder => {
    builder.addCase(setLoggedIn, (state, action) => {
      if (!action.payload) {
        return initialState;
      }
    });
  },
});

export const {
  setEquipment,
  setCoolDown,
  setExercises,
  setFitnessGoal,
  setLevel,
  setLoading,
  setSavedWorkouts,
  setShareModalVisible,
  setStrengthArea,
  setWarmUp,
  setWorkout,
  viewWorkout,
  getExercises,
  getExercisesById,
  getSavedWorkouts,
  saveWorkout,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;
