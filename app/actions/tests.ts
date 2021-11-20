import {SavedTest} from '../types/SavedItem';
import Test from '../types/Test';

export const GET_TESTS = 'GET_TESTS';
export const SET_TESTS = 'SET_TESTS';
export const SAVE_TEST = 'SAVE_TEST';
export const GET_SAVED_TESTS = 'GET_SAVED_TESTS';
export const SET_SAVED_TESTS = 'SET_SAVED_TESTS';
interface SetTestsAction {
  type: typeof SET_TESTS;
  tests: {[key: string]: Test};
}

export interface GetTestsAction {
  type: typeof GET_TESTS;
}

export interface SaveTestAction {
  type: typeof SAVE_TEST;
  payload: SavedTest;
}

export interface GetSavedTestsAction {
  type: typeof GET_SAVED_TESTS;
}

export interface SetSavedTestsAction {
  type: typeof SET_SAVED_TESTS;
  payload: {[key: string]: SavedTest};
}

export const setTests = (tests: {[key: string]: Test}): SetTestsAction => ({
  type: SET_TESTS,
  tests,
});

export const getTests = (): GetTestsAction => ({
  type: GET_TESTS,
});

export const saveTest = (payload: SavedTest): SaveTestAction => ({
  type: SAVE_TEST,
  payload,
});

export const getSavedTests = (): GetSavedTestsAction => ({
  type: GET_SAVED_TESTS,
});

export const setSavedTests = (savedTests: {
  [key: string]: SavedTest;
}): SetSavedTestsAction => ({
  type: SET_SAVED_TESTS,
  payload: savedTests,
});

export type TestsActions =
  | SetTestsAction
  | SaveTestAction
  | GetSavedTestsAction
  | SetSavedTestsAction;
