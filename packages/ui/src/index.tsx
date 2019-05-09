import * as React from "react";
import * as ReactDOM from "react-dom";
import {hot} from "react-hot-loader";
import App from "./App";

const HotApp = hot(module)(App);

const render = () => {
  ReactDOM.render(<HotApp />, document.getElementById("root"));
};

render();
