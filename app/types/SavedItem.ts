import {ExerciseEvent, PlanWorkout, Sample} from './Shared';

export interface SavedWorkout {
  id?: string;
  workout: string[];
  calories?: number;
  seconds: number;
  difficulty: number;
  createdate: Date;
  saved?: boolean;
  planWorkout?: PlanWorkout;
  averageHeartRate: number;
  heartRateSamples: Sample[];
  exerciseEvents: ExerciseEvent[];
}

export interface SavedTest {
  id?: string;
  createdate: Date;
  seconds?: number;
  result: number;
  testId: string;
  saved?: boolean;
}

export interface SavedQuickRoutine {
  id?: string;
  calories: number;
  seconds: number;
  difficulty: number;
  createdate: Date;
  quickRoutineId: string;
  saved?: boolean;
  averageHeartRate: number;
  heartRateSamples: Sample[];
  exerciseEvents: ExerciseEvent[];
}
