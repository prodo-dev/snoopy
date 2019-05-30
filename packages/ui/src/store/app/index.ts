import {Context, emptyContext, FilePath} from "../../models";

export type Action =
  | {
      type: "app/SET_SIDEBAR_OPEN";
      value: boolean;
    }
  | {
      type: "app/SET_SELECTED_PATHS";
      paths: Set<FilePath>;
    };

export interface State {
  isSidebarOpen: boolean;
  selectedPaths: Set<FilePath>;
  context: Context;
}

export const initialState = (
  context: Context,
  selectedPaths: Set<FilePath> = new Set(context.components.map(c => c.path)),
): State => ({
  isSidebarOpen: true,
  selectedPaths,
  context,
});

export const setSidebarOpen = (value: boolean): Action => ({
  type: "app/SET_SIDEBAR_OPEN",
  value,
});

export const setSelectedPaths = (paths: Set<FilePath>): Action => ({
  type: "app/SET_SELECTED_PATHS",
  paths,
});

export const actions = {
  setSidebarOpen,
  setSelectedPaths,
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
  }

  return state;
};
