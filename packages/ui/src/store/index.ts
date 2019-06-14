import * as _ from "lodash";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger";
import {Context} from "../models";
import appReducer, {
  Action as AppAction,
  initialState as appInitialState,
  State as AppState,
} from "./app";
import contextReducer, {
  initialState as contextInitialState,
  State as ContextState,
} from "./context";
import {getState, saveState} from "./persistence";

export interface State {
  app: AppState;
  context: ContextState;
}

export type Action = AppAction;

const SAVE_STATE_THROTTLE = 500; // ms

export default (context: Context) => {
  const savedState = getState();

  const initialState: State = {
    app: appInitialState(context, savedState.app || {}),
    context: contextInitialState(context),
  };

  const middleware = [createLogger()];

  const store = createStore(
    combineReducers<State>({
      app: appReducer,
      context: contextReducer,
    }),
    initialState,
    applyMiddleware(...middleware),
  );

  store.subscribe(
    _.throttle(() => {
      saveState(store.getState());
    }, SAVE_STATE_THROTTLE),
  );

  return store;
};
