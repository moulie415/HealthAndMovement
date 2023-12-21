import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {Goal, Level} from '../types/Shared';

export interface SettingsWorkoutGoal {
  mins: number;
  calories: number;
  workouts: {
    level: Level;
    number: number;
  };
}

export interface SettingsState {
  ads: boolean;
  admins: string[];
  workoutGoals: {[key in Goal]?: SettingsWorkoutGoal};
}

const initialState: SettingsState = {
  ads: true,
  admins: [],
  workoutGoals: {
    weightLoss: {
      calories: 3500,
      mins: 180,
      workouts: {
        level: Level.INTERMEDIATE,
        number: 4,
      },
    },
    active: {
      calories: 3500,
      mins: 150,
      workouts: {
        level: Level.INTERMEDIATE,
        number: 5,
      },
    },
    strength: {
      calories: 3500,
      mins: 150,
      workouts: {
        level: Level.INTERMEDIATE,
        number: 5,
      },
    },
  },
};

export const SETTINGS = 'settings';

export type SETTINGS = typeof SETTINGS;

export const SET_SETTINGS = `${SETTINGS}/setSettings`;

export type SET_SETTINGS = typeof SET_SETTINGS;

export const settingSlice = createSlice({
  name: SETTINGS,
  initialState,
  reducers: {
    setSettings: (
      state: SettingsState,
      {payload}: PayloadAction<SettingsState>,
    ) => {
      return payload;
    },
  },
});

export const {setSettings} = settingSlice.actions;

export default settingSlice.reducer;
