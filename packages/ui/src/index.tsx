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
