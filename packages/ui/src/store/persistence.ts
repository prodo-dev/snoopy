interface State {
  [key: string]: any;
}

export const STORAGE_KEY = "redux";

export const PERSISTENCE_PATHS = ["app"];

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

const getLocalStorage = () => {
  try {
    return (window as any).localStorage;
  } catch (err) {
    return null;
  }
};
export const saveState = (state: State) => {
  const stateToSave = select(state, PERSISTENCE_PATHS);
  const localStorage = getLocalStorage();
  if (localStorage) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }
};

export const getState = (): State => {
  const localStorage = getLocalStorage();

  if (!localStorage) {
    return {};
  }

  const item = localStorage.getItem(STORAGE_KEY);

  if (item == null) {
    return {};
  }

  try {
    return JSON.parse(item);
  } catch (err) {
    return {};
  }
};
