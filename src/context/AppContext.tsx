import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react';
import type { AppState, AppAction, Chapter } from '../types';

const STORAGE_KEY = 'inweeks_v1';

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts (HTTP over network IP, old browsers)
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

const initialState: AppState = {
  profile: null,
  chapters: [],
  darkMode: false,
  hasCompletedOnboarding: false,
  gridAnimationPhase: 'idle',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'ADD_CHAPTER':
      return { ...state, chapters: [...state.chapters, action.payload] };
    case 'UPDATE_CHAPTER':
      return {
        ...state,
        chapters: state.chapters.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CHAPTER':
      return {
        ...state,
        chapters: state.chapters.filter(c => c.id !== action.payload),
      };
    case 'REORDER_CHAPTERS':
      return { ...state, chapters: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_DARK_MODE':
      return { ...state, darkMode: action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, hasCompletedOnboarding: true };
    case 'SET_GRID_ANIMATION_PHASE':
      return { ...state, gridAnimationPhase: action.payload };
    case 'RESET':
      return { ...initialState };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function loadPersistedState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== 1) return null;
    return {
      profile: parsed.profile ?? null,
      chapters: parsed.chapters ?? [],
      darkMode: parsed.darkMode ?? false,
      hasCompletedOnboarding: parsed.hasCompletedOnboarding ?? false,
    };
  } catch {
    return null;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addChapter: (chapter: Omit<Chapter, 'id'>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const persisted = loadPersistedState();
    if (persisted) {
      return { ...init, ...persisted, gridAnimationPhase: 'idle' as const };
    }
    return init;
  });

  // Persist state changes (debounced via effect)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          version: 1,
          profile: state.profile,
          chapters: state.chapters,
          darkMode: state.darkMode,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
        }));
      } catch { /* quota */ }
    }, 500);
    return () => clearTimeout(timer);
  }, [state.profile, state.chapters, state.darkMode, state.hasCompletedOnboarding]);

  // Sync dark mode to DOM with flash overlay transition
  const darkModeInitialized = useRef(false);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.darkMode ? 'dark' : 'light');

    // Skip the flash on initial mount
    if (!darkModeInitialized.current) {
      darkModeInitialized.current = true;
      return;
    }

    // Create a flash overlay for smooth transition
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.background = state.darkMode ? '#000' : '#fff';
    document.body.appendChild(overlay);

    const timer = setTimeout(() => {
      overlay.remove();
    }, 400);

    return () => {
      clearTimeout(timer);
      overlay.remove();
    };
  }, [state.darkMode]);

  // Also check system preference on first load if no persisted preference
  useEffect(() => {
    const persisted = loadPersistedState();
    if (!persisted) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        dispatch({ type: 'SET_DARK_MODE', payload: true });
      }
    }
  }, []);

  const addChapter = (chapter: Omit<Chapter, 'id'>) => {
    dispatch({
      type: 'ADD_CHAPTER',
      payload: { ...chapter, id: generateId() },
    });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, addChapter }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
