import { createContext } from 'react';
import type { AppState, AppAction, Chapter } from '../types';

export interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addChapter: (chapter: Omit<Chapter, 'id'>) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);
