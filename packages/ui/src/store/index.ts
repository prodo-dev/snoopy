import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger";
import appReducer, {State as AppState} from "./app";

export interface State {
  app: AppState;
}

const middleware = [createLogger()];

export const store = createStore(
  combineReducers({app: appReducer}),
  applyMiddleware(...middleware),
);
