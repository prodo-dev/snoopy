interface State {
  [key: string]: any;
}

export const STORAGE_KEY = "redux";

export const PERSISTENCE_PATHS = ["app.selectedPaths", "app.isSidebarOpen"];

const addToSelection = (
  selection: State,
  path: string[],
  state: {[key: string]: any},
) => {
  if (path.length === 1) {
    const key = path[0];
    if (key === "*") {
      Object.keys(state).forEach(
        stateKey => (selection[stateKey] = state[stateKey]),
      );
    } else {
      selection[key] = state[key];
    }
  } else {
    const key = path[0];
    if (key === "*") {
      Object.keys(state).forEach(stateKey => {
        if (selection[stateKey] == null) {
          selection[stateKey] = {};
        }
        addToSelection(selection[stateKey], path.slice(1), state[stateKey]);
      });
    } else {
      if (selection[key] == null) {
        selection[key] = {};
      }
      addToSelection(selection[key], path.slice(1), state[key]);
    }
  }
};

export const select = (state: State, paths: string[]) => {
  const selection: State = {};
  paths.forEach(path => addToSelection(selection, path.split("."), state));
  return selection;
};