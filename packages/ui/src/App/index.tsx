import * as React from "react";
import {components} from "../../components-generated";
import Component from "../components/Component";

const App = () => (
  <div>
    <h1>Snoopy</h1>
    {components.map(({name, component}) => (
      <Component key={name} name={name} component={component} />
    ))}
  </div>
);

export default App;
