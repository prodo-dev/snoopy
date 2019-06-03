import {Context, emptyContext, FilePath, Theme} from "../../models";

export type Action =
  | {
      type: "app/SET_SIDEBAR_OPEN";
      value: boolean;
    }
  | {
      type: "app/SET_SELECTED_PATHS";
      paths: FilePath[];
    }
  | {
      type: "app/SET_SELECTED_THEME";
      selectedTheme: string;
    };

export interface State {
  isSidebarOpen: boolean;
  selectedPaths: FilePath[];
  selectedTheme: string | null;
}

const getSelectedThemeKey = (
  themes: {[name: string]: Theme},
  savedThemeKey: string | null,
): string | null => {
  if (Object.keys(themes).length === 0) {
    return null;
  }

  const firstThemeKey = Object.keys(themes)[0];
  const savedThemeExists =
    savedThemeKey != null && themes[savedThemeKey] != null;

  return savedThemeExists ? savedThemeKey : firstThemeKey;
};

export const initialState = (
  context: Context,
  savedAppState: Partial<State> = {},
): State => {
  const selectedTheme = getSelectedThemeKey(
    context.themes,
    savedAppState.selectedTheme || null,
  );

  return {
    isSidebarOpen: true,
    selectedPaths: context.components.map(c => c.path),
    selectedTheme,
    ...savedAppState,
  };
};

export const setSidebarOpen = (value: boolean): Action => ({
  type: "app/SET_SIDEBAR_OPEN",
  value,
});

export const setSelectedPaths = (paths: FilePath[]): Action => ({
  type: "app/SET_SELECTED_PATHS",
  paths,
});

export const setSelectedTheme = (selectedTheme: string): Action => ({
  type: "app/SET_SELECTED_THEME",
  selectedTheme,
});

export const actions = {
  setSidebarOpen,
  setSelectedPaths,
  setSelectedTheme,
};

export default (
  state: State = initialState(emptyContext),
  action: Action,
): State => {
  if (action.type === "app/SET_SIDEBAR_OPEN") {
    return {
      ...state,
      isSidebarOpen: action.value,
    };
  } else if (action.type === "app/SET_SELECTED_PATHS") {
    return {
      ...state,
      selectedPaths: [...action.paths],
    };
  } else if (action.type === "app/SET_SELECTED_THEME") {
    return {
      ...state,
      selectedTheme: action.selectedTheme,
    };
  }

  return state;
};
