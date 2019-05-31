import * as _ from "lodash";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger";
import {Context} from "../models";
import appReducer, {
  Action as AppAction,
  initialState as appInitialState,
  State as AppState,
} from "./app";
import {getState, saveState} from "./persistence";

export interface State {
  app: AppState;
}

export type Action = AppAction;

const SAVE_STATE_THROTTLE = 500;

export default (context: Context) => {
  const initialState: State = {
    app: appInitialState(context),
  };
  const savedState = getState();
  const newInitialState = _.mergeWith(initialState, savedState, (_, srcValue) =>
    Array.isArray(srcValue) ? srcValue : undefined,
  );

  const middleware = [createLogger()];

  const store = createStore(
    combineReducers({app: appReducer}),
    newInitialState,
    applyMiddleware(...middleware),
  );

  store.subscribe(
    _.throttle(() => {
      saveState(store.getState());
    }, SAVE_STATE_THROTTLE),
  );

  return store;
};
