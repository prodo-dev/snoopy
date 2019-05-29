export interface Action {
  type: "app/SET_SIDEBAR_OPEN";
  value: boolean;
}

export interface State {
  isSidebarOpen: boolean;
}

const initialState: State = {
  isSidebarOpen: true,
};

export const setSidebarOpen = (value: boolean): Action => ({
  type: "app/SET_SIDEBAR_OPEN",
  value,
});

export const actions = {
  setSidebarOpen,
};

export default (state: State = initialState, action: Action): State => {
  if (action.type === "app/SET_SIDEBAR_OPEN") {
    return {
      ...state,
      isSidebarOpen: action.value,
    };
  }

  return state;
};
