import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import {ThemeProvider} from "styled-components";
import {components as componentsUntyped} from "../../components-generated";
import {Component} from "../models";
import ComponentPage from "../routes/ComponentPage";
import HomePage from "../routes/HomePage";
import {darkTheme} from "../styles/theme";

import "./index.css";

const components = componentsUntyped as Component[];

const ComponentPageWithProps = (props: RouteComponentProps<{name: string}>) => {
  const component = components.filter(
    c => c.name.toLowerCase() === props.match.params.name.toLowerCase(),
  )[0];
  return <ComponentPage component={component} />;
};

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/:name" exact component={ComponentPageWithProps} />
      </Switch>
    </Router>
  </ThemeProvider>
);

export default App;
