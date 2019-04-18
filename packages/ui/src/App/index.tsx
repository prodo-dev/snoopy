import * as React from "react";
import {components} from "../../components-generated";
import Component from "../components/Component";

const App = () => (
  <div>
    <h1>Snoopy</h1>
    {components.map((C, i) => (
      <Component key={i} component={C} />
    ))}
  </div>
);

export default App;
