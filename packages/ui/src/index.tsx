import * as React from "react";
import * as ReactDOM from "react-dom";

import {components} from "./component-list";
console.log(components);

const App = () => (
  <div>
    <h1>Hello, World!</h1>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
