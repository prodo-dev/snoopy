import {applyMiddleware, combineReducers, createStore} from "redux";
import {createLogger} from "redux-logger";
import {Context} from "../models";
import appReducer, {
  initialState as appInitialState,
  State as AppState,
} from "./app";

export interface State {
  app: AppState;
}

export default (context: Context) => {
  const initialState: State = {
    app: appInitialState(context),
  };

  const middleware = [createLogger()];

  const store = createStore(
    combineReducers({app: appReducer}),
    initialState,
    applyMiddleware(...middleware),
  );

  return store;
};