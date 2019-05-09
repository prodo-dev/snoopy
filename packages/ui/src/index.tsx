import {WebSocketEvents} from "@prodo-ai/snoopy-api";
import * as React from "react";
import * as ReactDOM from "react-dom";

const render = () => {
  const App = require("./App").default;
  ReactDOM.render(<App />, document.getElementById("root"));
};

if (module.hot) {
  module.hot.accept(render);
}

render();

const socket = new WebSocket(location.origin.replace(/^http(s?):/, "ws$1:"));
socket.addEventListener("message", event => {
  const data = JSON.parse(event.data);
  if (data.type === WebSocketEvents.OPEN_FILE) {
    window.location.href = `/${data.file}`;
  }
});
