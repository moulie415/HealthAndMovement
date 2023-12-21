import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import QuickRoutine from '../types/QuickRoutines';
import {SavedQuickRoutine} from '../types/SavedItem';
import {setLoggedIn} from './profile';

export interface QuickRoutinesState {
  quickRoutines: {[key: string]: QuickRoutine};
  savedQuickRoutines: {[key: string]: SavedQuickRoutine};
}

const initialState: QuickRoutinesState = {
  quickRoutines: {},
  savedQuickRoutines: {},
};

export const QUICK_ROUTINES = 'quickRoutines';

export type QUICK_ROUTINES = typeof QUICK_ROUTINES;

export const GET_QUICK_ROUTINES = `${QUICK_ROUTINES}/getQuickRoutines`;
export type GET_QUICK_ROUTINES = typeof GET_QUICK_ROUTINES;

export const GET_SAVED_QUICK_ROUTINES = `${QUICK_ROUTINES}/getSavedQuickRoutines`;
export type GET_SAVED_QUICK_ROUTINES = typeof GET_SAVED_QUICK_ROUTINES;

export const SET_SAVED_QUICK_ROUTINES = `${QUICK_ROUTINES}/setSavedQuickRoutines`;
export type SET_SAVED_QUICK_ROUTINES = typeof SET_SAVED_QUICK_ROUTINES;

export const GET_QUICK_ROUTINES_BY_ID = `${QUICK_ROUTINES}/getQuickRoutinesById`;
export type GET_QUICK_ROUTINES_BY_ID = typeof GET_QUICK_ROUTINES_BY_ID;

export const SET_QUICK_ROUTINES = `${QUICK_ROUTINES}/setQuickRoutines`;
export type SET_QUICK_ROUTINES = typeof SET_QUICK_ROUTINES;

export const SAVE_QUICK_ROUTINE = `${QUICK_ROUTINES}/saveQuickRoutine`;
export type SAVE_QUICK_ROUTINE = typeof SAVE_QUICK_ROUTINE;

export const START_QUICK_ROUTINE = `${QUICK_ROUTINES}/startQuickRoutine`;
export type START_QUICK_ROUTINE = typeof START_QUICK_ROUTINE;

const quickRoutineSlice = createSlice({
  name: QUICK_ROUTINES,
  initialState,
  reducers: {
    setQuickRoutines: (
      state: QuickRoutinesState,
      {payload}: PayloadAction<{[key: string]: QuickRoutine}>,
    ) => {
      state.quickRoutines = {...state.quickRoutines, ...payload};
    },
    setSavedQuickRoutines: (
      state: QuickRoutinesState,
      {payload}: PayloadAction<{[key: string]: SavedQuickRoutine}>,
    ) => {
      state.savedQuickRoutines = {...state.savedQuickRoutines, ...payload};
    },
    startQuickRoutine: (
      state: QuickRoutinesState,
      {payload}: PayloadAction<QuickRoutine>,
    ) => {},
    saveQuickRoutine: (
      state: QuickRoutinesState,
      {payload}: PayloadAction<SavedQuickRoutine>,
    ) => {},
    getQuickRoutinesById: (
      state: QuickRoutinesState,
      {payload}: PayloadAction<string[]>,
    ) => {},
    getQuickRoutines: () => {},
    getSavedQuickRoutines: () => {},
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
  setQuickRoutines,
  setSavedQuickRoutines,
  startQuickRoutine,
  saveQuickRoutine,
  getQuickRoutines,
  getQuickRoutinesById,
  getSavedQuickRoutines,
} = quickRoutineSlice.actions;

export default quickRoutineSlice.reducer;
