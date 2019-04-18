import * as React from "react";
import {components} from "../../components-generated";

const App = () => (
  <div>
    <h1>Hello, World!</h1>
    {components.map((C, i) => (
      <C key={i} />
    ))}
  </div>
);

export default App;
