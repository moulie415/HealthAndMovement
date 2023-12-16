import {Area} from './QuickRoutines';
import {
  Level,
  Goal,
  FlexibilityArea,
  WarmUp,
  CoolDown,
  Equipment as EquipmentItem,
} from './Shared';

export interface Thumbnail {
  src: string;
  title: string;
}

export interface Video {
  src: string;
  title: string;
}
export default interface Exercise {
  id?: string;
  name: string;
  description: string;
  level?: Level;
  type?: Goal;
  area?: Area;
  flexibilityArea?: FlexibilityArea;
  equipment?: EquipmentItem[];
  muscles?: Muscle[];
  musclesSecondary?: Muscle[];
  warmUp?: WarmUp;
  coolDown?: CoolDown;
  live?: boolean;
  premium?: boolean;
  reps?: string;
  sets?: string;
  resistance?: string;
  thumbnail?: Thumbnail;
  video?: Video;
  resistanceScale?: string;
  duration?: string;
  notes?: string;
  weight?: string;
  time?: number;
}

export type Muscle =
  | 'chest'
  | 'upperBack'
  | 'midBack'
  | 'lowBack'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'abdominals'
  | 'obliques'
  | 'leg'
  | 'gluteals'
  | 'hamstrings'
  | 'quadriceps'
  | 'calves'
  | 'hipFlexors'
  | 'iliotibialBand'
  | 'rotatorCuff'
  | 'innerThigh'
  | 'all'
  | 'upperBody'
  | 'arms';
