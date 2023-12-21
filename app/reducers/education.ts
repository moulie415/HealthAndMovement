import Education from '../types/Education';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {setLoggedIn} from './profile';

export interface EducationState {
  education: {[key: string]: Education};
  loading: boolean;
}

const initialState: EducationState = {
  education: {},
  loading: false,
};

export const EDUCATION = 'education';

export type EDUCATION = typeof EDUCATION;

export const SET_EDUCATION = `${EDUCATION}/setEducation`;
export type SET_EDUCATION = typeof SET_EDUCATION;

export const SET_EDUCATION_LOADING = `${EDUCATION}/setEducationLoading`;
export type SET_EDUCATION_LOADING = typeof SET_EDUCATION_LOADING;

export const GET_EDUCATION = `${EDUCATION}/getEducation`;
export type GET_EDUCATION = typeof GET_EDUCATION;

export const GET_EDUCATION_BY_ID = `${EDUCATION}/getEducationById`;
export type GET_EDUCATION_BY_ID = typeof GET_EDUCATION_BY_ID;

const educationSlice = createSlice({
  name: EDUCATION,
  initialState,
  reducers: {
    setEducation: (
      state: EducationState,
      {payload}: PayloadAction<{[key: string]: Education}>,
    ) => {
      state.education = payload;
    },
    setEducationLoading: (
      state: EducationState,
      {payload}: PayloadAction<boolean>,
    ) => {
      state.loading = payload;
    },
    getEducation: () => {},
    getEducationById: (
      state: EducationState,
      {payload}: PayloadAction<string[]>,
    ) => {},
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
  setEducationLoading,
  setEducation,
  getEducation,
  getEducationById,
} = educationSlice.actions;

export default educationSlice.reducer;
