import {EducationState} from '../reducers/education';
import {ExercisesState} from '../reducers/exercises';
import {ProfileState} from '../reducers/profile';
import {QuickRoutinesState} from '../reducers/quickRoutines';
import {SettingsState} from '../reducers/settings';
import {TestsState} from '../reducers/tests';
import {Gender} from './Profile';
import {Area, Equipment as EquipmentLevel} from './QuickRoutines';

export type MyRootState = {
  exercises: ExercisesState;
  profile: ProfileState;
  tests: TestsState;
  quickRoutines: QuickRoutinesState;
  education: EducationState;
  settings: SettingsState;
};

export enum Level {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum Goal {
  STRENGTH = 'strength',
  WEIGHT_LOSS = 'weightLoss',
  ACTIVE = 'active',
}

export enum WarmUp {
  CIRCULATORY = 'circulatory',
  SOFT_TISSUE = 'softTissue',
  DYNAMIC_STRETCHING = 'dynamicStretching',
}

export enum CoolDown {
  CIRCULATORY = 'circulatory',
  STATIC_STRETCHING = 'staticStretching',
}

export enum FlexibilityArea {
  SHOULDERS = 'shoulders',
  HIPS = 'hips',
  SPINE = 'spine',
}

export interface Sample {
  startDate: string;
  endDate: string;
  value: number;
}

export interface StepSample {
  date: string;
  value: number;
}

export interface ExerciseEvent {
  value: number;
  time: Date;
}

export interface PauseEvent {
  paused: boolean;
  time: Date;
}

export enum Equipment {
  NONE = 'none',
  BARBELLS = 'barbells',
  DUMBBELLS = 'dumbbells',
  BENCHES = 'benches',
  CABLE_MACHINES = 'cableMachines',
  KETTLEBELLS = 'kettlebells',
  PULL_UP_BAR = 'pullUpBar',
  SQUAT_RACK = 'squatRack',
  EXERCISE_BALL = 'exerciseBall',
  BOSU_BALL = 'bosuBall',
  AGILITY_LADDER = 'agilityLadder',
  PLYOMETRIC_BOX = 'plyometricBox',
  TRX_SUSPENSION_TRAINER = 'trxSuspensionTrainer',
  MEDICINE_BALLS = 'medicineBalls',
  LANDMINE = 'landmine',
  EXERCISE_STEP = 'exerciseStep',
}

export interface PlanExercise {
  exercise: string;
  sets: string;
  reps: string;
  duration: string;
  resistanceScale: string;
  restTime: string;
  additionalNotes: string;
  time?: number;
}

export interface PlanWorkout {
  name: string;
  steps?: string[];
  dates: string[];
  exercises: PlanExercise[];
  today?: boolean;
  level: Level;
}

export interface PlanNutrition {
  preWorkout: string;
  postWorkout: string;
  general: string;
}

export interface PlanSleep {
  general: string;
}

export interface Plan {
  id: string;
  user: string;
  workouts: PlanWorkout[];
  nutrition: PlanNutrition;
  sleep: PlanSleep;
  tests: string[];
  education: string[];
}

export interface CalendarType {
  /** Unique calendar ID. */
  id: string;
  /** The calendar’s title. */
  title: string;
  /** The calendar’s type. */
  type: string;
  /** The source object representing the account to which this calendar belongs. */
  source: string;
  /** Indicates if the calendar is assigned as primary. */
  isPrimary: boolean;
  /** Indicates if the calendar allows events to be written, edited or removed. */
  allowsModifications: boolean;
  /** The color assigned to the calendar represented as a hex value. */
  color: string;
  /** The event availability settings supported by the calendar. */
  allowedAvailabilities: string[];
}

export interface SignUpPayload {
  name: string;
  surname: string;
  dob: string;
  weight: number;
  height: number;
  gender: Gender;
  marketing: boolean;
  goal: Goal;
  area: Area;
  equipment: EquipmentLevel;
  experience: Level;
  fromProfile?: boolean;
}

export interface UpdateProfilePayload {
  dob?: string;
  weight?: number;
  height?: number;
  gender?: Gender;
  marketing?: boolean;
  goal?: Goal;
  avatar?: string;
  bodyFatPercentage?: number;
  muscleMass?: number;
  boneMass?: number;
  workoutReminders?: boolean;
  workoutReminderTime?: string;
  testReminderTime?: string;
  testReminders?: boolean;
  autoPlay?: boolean;
  prepTime?: number;
  workoutMusic?: boolean;
  syncPlanWithCalendar?: boolean;
  goalReminders?: boolean;
}
