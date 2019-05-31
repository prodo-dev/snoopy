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
      theme: Theme;
    };

export interface State {
  isSidebarOpen: boolean;
  selectedPaths: FilePath[];
  selectedTheme: Theme | null;
}

export const initialState = (
  context: Context,
  savedAppState: Partial<State> = {},
): State => {
  const selectedTheme = context.themes.length !== 0 ? context.themes[0] : null;

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

export const setSelectedTheme = (theme: Theme): Action => ({
  type: "app/SET_SELECTED_THEME",
  theme,
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
      selectedPaths: action.paths,
    };
  } else if (action.type === "app/SET_SELECTED_THEME") {
    return {
      ...state,
      selectedTheme: action.theme,
    };
  }

  return state;
};
