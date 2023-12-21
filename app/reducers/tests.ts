import Test from '../types/Test';
import {SavedTest} from '../types/SavedItem';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {setLoggedIn} from './profile';

export interface TestsState {
  tests: {[key: string]: Test};
  savedTests: {[key: string]: SavedTest};
}

const initialState: TestsState = {
  tests: {},
  savedTests: {},
};

export const TESTS = 'tests';

export type TESTS = typeof TESTS;

export const SET_TESTS = `${TESTS}/setTests`;
export type SET_TESTS = typeof SET_TESTS;

export const SET_SAVED_TESTS = `${TESTS}/setSavedTests`;
export type SET_SAVED_TESTS = typeof SET_SAVED_TESTS;

export const GET_SAVED_TESTS = `${TESTS}/getSavedTests`;
export type GET_SAVED_TESTS = typeof GET_SAVED_TESTS;

export const GET_TESTS = `${TESTS}/getTests`;
export type GET_TESTS = typeof GET_TESTS;

export const GET_TESTS_BY_ID = `${TESTS}/getTestsById`;
export type GET_TESTS_BY_ID = typeof GET_TESTS_BY_ID;

export const SAVE_TEST = `${TESTS}/saveTest`;
export type SAVE_TEST = typeof SAVE_TEST;

const testSlice = createSlice({
  name: TESTS,
  initialState,
  reducers: {
    setTests: (
      state: TestsState,
      {payload}: PayloadAction<{[key: string]: Test}>,
    ) => {
      state.tests = payload;
    },

    setSavedTests: (
      state: TestsState,
      {payload}: PayloadAction<{[key: string]: SavedTest}>,
    ) => {
      state.savedTests = {...state.savedTests, ...payload};
    },
    saveTest: (state: TestsState, {payload}: PayloadAction<SavedTest>) => {},
    getTests: () => {},
    getTestsById: (state: TestsState, {payload}: PayloadAction<string[]>) => {},
    getSavedTests: () => {},
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
  setTests,
  setSavedTests,
  getTests,
  getTestsById,
  getSavedTests,
  saveTest,
} = testSlice.actions;
export default testSlice.reducer;
