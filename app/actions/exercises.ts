import Exercise from '../types/Exercise';
import {SavedWorkout} from '../types/SavedItem';
import {CardioType, Goal, Level, StrengthArea} from '../types/Shared';
import {SetLoggedInAction} from './profile';

export const GET_EXERCISES = 'GET_EXERCISES';
export const SET_EXERCISES = 'SET_EXERCISES';
export const ADD_EXERCISE = 'ADD_EXERCISE';
export const DELETE_EXERCISE = 'DELETE_EXERCISE';
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE';
export const SET_LOADING = 'SET_LOADING';
export const SET_WORKOUT = 'SET_WORKOUT';
export const SET_EXERCISE_NOTE = 'SET_EXERCISE_NOTE';
export const SET_WORKOUT_NOTE = 'SET_WORKOUT_NOTE';
export const DOWNLOAD_VIDEO = 'DOWNLOAD_VIDEO';
export const SET_VIDEO = 'SET_VIDEO';
export const SET_VIDEO_LOADING = 'VIDEO_LOADING';
export const SAVE_WORKOUT = 'SAVED_WORKOUT';
export const GET_SAVED_WORKOUTS = 'GET_SAVED_WORKOUTS';
export const SET_SAVED_WORKOUTS = 'SET_SAVED_WORKOUTS';

export interface GetExercisesAction {
  type: typeof GET_EXERCISES;
  payload: {
    level: Level;
    goal: Goal;
    area: StrengthArea;
    cardioType: CardioType;
  };
}

export interface AddExerciseAction {
  type: typeof ADD_EXERCISE;
  payload: Exercise;
}

export interface DeleteExerciseAction {
  type: typeof DELETE_EXERCISE;
  payload: string;
}

export interface UpdateExerciseAction {
  type: typeof UPDATE_EXERCISE;
  payload: Exercise;
}
export interface SetExercisesAction {
  type: typeof SET_EXERCISES;
  exercises: {[key: string]: Exercise};
}

export interface SetLoadingAction {
  type: typeof SET_LOADING;
  loading: boolean;
}

export interface SetWorkoutAction {
  type: typeof SET_WORKOUT;
  payload: Exercise[];
}

export interface SetExerciseNoteAction {
  type: typeof SET_EXERCISE_NOTE;
  payload: {exercise: string; note: string};
}

export interface SetWorkoutNoteAction {
  type: typeof SET_WORKOUT_NOTE;
  payload: {workout: string; note: string};
}

export interface DownloadVideoAction {
  type: typeof DOWNLOAD_VIDEO;
  payload: string;
}

export interface SetVideoLoadingAction {
  type: typeof SET_VIDEO_LOADING;
  payload: boolean;
}

export interface SetVideoAction {
  type: typeof SET_VIDEO;
  payload: {id: string; src: string; path: string};
}

export interface SaveWorkoutAction {
  type: typeof SAVE_WORKOUT;
  payload: SavedWorkout;
}

export interface GetSavedWorkoutsAction {
  type: typeof GET_SAVED_WORKOUTS;
}

export interface SetSavedWorkoutsAction {
  type: typeof SET_SAVED_WORKOUTS;
  payload: {[key: string]: SavedWorkout};
}

export const getExercises = (
  level: Level,
  goal: Goal,
  area: StrengthArea,
  cardioType: CardioType,
): GetExercisesAction => ({
  type: GET_EXERCISES,
  payload: {level, goal, area, cardioType},
});

export const addExercise = (exercise: Exercise): AddExerciseAction => ({
  type: ADD_EXERCISE,
  payload: exercise,
});
export const deleteExercise = (id: string): DeleteExerciseAction => ({
  type: DELETE_EXERCISE,
  payload: id,
});
export const updateExercise = (exercise: Exercise): UpdateExerciseAction => ({
  type: UPDATE_EXERCISE,
  payload: exercise,
});

export const setExercises = (exercises: {
  [key: string]: Exercise;
}): SetExercisesAction => ({
  type: SET_EXERCISES,
  exercises,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  loading,
});

export const setWorkout = (payload: Exercise[]): SetWorkoutAction => ({
  type: SET_WORKOUT,
  payload,
});

export const setExerciseNote = (
  exercise: string,
  note: string,
): SetExerciseNoteAction => ({
  type: SET_EXERCISE_NOTE,
  payload: {exercise, note},
});

export const downloadVideo = (id: string): DownloadVideoAction => ({
  type: DOWNLOAD_VIDEO,
  payload: id,
});

export const setVideo = (
  id: string,
  src: string,
  path: string,
): SetVideoAction => ({
  type: SET_VIDEO,
  payload: {id, src, path},
});

export const setVideoLoading = (payload: boolean): SetVideoLoadingAction => ({
  type: SET_VIDEO_LOADING,
  payload,
});

export const saveWorkout = (payload: SavedWorkout): SaveWorkoutAction => ({
  type: SAVE_WORKOUT,
  payload,
});

export const getSavedWorkouts = (): GetSavedWorkoutsAction => ({
  type: GET_SAVED_WORKOUTS,
});

export const setSavedWorkouts = (savedWorkouts: {
  [key: string]: SavedWorkout;
}): SetSavedWorkoutsAction => ({
  type: SET_SAVED_WORKOUTS,
  payload: savedWorkouts,
});

export type ExercisesActions =
  | SetExercisesAction
  | GetExercisesAction
  | SetWorkoutAction
  | SetExerciseNoteAction
  | SetWorkoutNoteAction
  | DownloadVideoAction
  | SetVideoAction
  | SetVideoLoadingAction
  | SetLoadingAction
  | SaveWorkoutAction
  | GetSavedWorkoutsAction
  | SetSavedWorkoutsAction;
