export interface CountryLifeExpectancy {
  code: string;
  name: string;
  male: number;
  female: number;
  overall: number;
}

export interface UserProfile {
  birthday: string;
  countryCode: string;
  lifeExpectancy: number;
  gender: 'male' | 'female' | 'overall';
}

export interface Chapter {
  id: string;
  name: string;
  color: string;
  startDate: string;
  endDate: string;
}

export type GridAnimationPhase = 'idle' | 'revealing' | 'complete';

export interface AppState {
  profile: UserProfile | null;
  chapters: Chapter[];
  darkMode: boolean;
  hasCompletedOnboarding: boolean;
  gridAnimationPhase: GridAnimationPhase;
}

export type AppAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'ADD_CHAPTER'; payload: Chapter }
  | { type: 'UPDATE_CHAPTER'; payload: Chapter }
  | { type: 'DELETE_CHAPTER'; payload: string }
  | { type: 'REORDER_CHAPTERS'; payload: Chapter[] }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'SET_GRID_ANIMATION_PHASE'; payload: GridAnimationPhase }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

export interface WeekData {
  index: number;
  year: number;
  weekInYear: number;
  date: Date;
  isLived: boolean;
  isCurrent: boolean;
  chapter: Chapter | null;
}

export interface LifeStats {
  weeksLived: number;
  weeksRemaining: number;
  totalWeeks: number;
  percentLived: number;
  ageYears: number;
  ageMonths: number;
  ageWeeks: number;
  currentWeekIndex: number;
}
