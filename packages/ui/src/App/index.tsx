import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import {components as componentsUntyped} from "../../components-generated";
import {Component} from "../models";
import ComponentPage from "../routes/ComponentPage";
import HomePage from "../routes/HomePage";

import "./index.css";

const components = componentsUntyped as Component[];

const ComponentPageWithProps = (props: RouteComponentProps<{name: string}>) => {
  const component = components.filter(
    c => c.name === props.match.params.name,
  )[0];
  return <ComponentPage component={component} />;
};

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/:name" exact component={ComponentPageWithProps} />
    </Switch>
  </Router>
);

export default App;
